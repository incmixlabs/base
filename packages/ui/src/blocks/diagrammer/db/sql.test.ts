import { describe, expect, it } from 'vitest'
import { sampleDbSchemaDiagramDocument } from './sample-data'
import { formatDbDiagramSql } from './sql'

describe('db diagram SQL formatter', () => {
  it('generates PostgreSQL DDL for schemas, secondary objects, tables, relationships, and indexes', () => {
    const sql = formatDbDiagramSql(sampleDbSchemaDiagramDocument)

    expect(sql).toContain('CREATE SCHEMA IF NOT EXISTS "public";')
    expect(sql).toContain('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
    expect(sql).toContain(
      `CREATE DOMAIN "public"."email_address" AS text CONSTRAINT "email_address_format_check" CHECK (VALUE LIKE '%@%');`,
    )
    expect(sql).toContain(
      "CREATE TYPE \"public\".\"order_status\" AS ENUM ('pending', 'paid', 'shipped', 'cancelled');",
    )
    expect(sql).toContain('CREATE SEQUENCE "public"."order_number_seq" AS bigint INCREMENT BY 1 START WITH 1000;')
    expect(sql).toContain('CREATE TABLE "public"."users"')
    expect(sql.indexOf('ALTER SEQUENCE "public"."order_number_seq" OWNED BY')).toBeGreaterThan(
      sql.indexOf('CREATE TABLE "public"."orders"'),
    )
    expect(sql).toContain('CONSTRAINT "users_pkey" PRIMARY KEY ("id")')
    expect(sql).toContain('CONSTRAINT "users_email_key" UNIQUE ("email")')
    expect(sql).toContain(
      'ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE;',
    )
    expect(sql).toContain('CREATE UNIQUE INDEX "users_email_idx" ON "public"."users" ("email");')
    expect(sql).toContain('CREATE VIEW "public"."order_summary" ("order_id", "customer_email", "total_cents") AS')
    expect(sql).toContain('CREATE MATERIALIZED VIEW "public"."customer_order_metrics" ("user_id", "order_count") AS')
    expect(sql).toContain(
      'CREATE FUNCTION "public"."touch_updated_at"() RETURNS trigger LANGUAGE plpgsql VOLATILE AS $$',
    )
    expect(sql).toContain(
      'CREATE TRIGGER "orders_touch_updated_at" BEFORE UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."touch_updated_at"();',
    )
    expect(sql).toContain(
      `CREATE POLICY "orders_tenant_policy" ON "public"."orders" FOR SELECT TO "app_user" USING (current_setting('app.user_id', true)::uuid = user_id);`,
    )
  })

  it('can omit foreign keys while keeping indexes', () => {
    const sql = formatDbDiagramSql(sampleDbSchemaDiagramDocument, {
      includeForeignKeys: false,
    })

    expect(sql).not.toContain('FOREIGN KEY')
    expect(sql).toMatch(/\bCREATE(\s+UNIQUE)?\s+INDEX\b/)
  })

  it('can omit indexes while keeping foreign keys', () => {
    const sql = formatDbDiagramSql(sampleDbSchemaDiagramDocument, {
      includeIndexes: false,
    })

    expect(sql).toContain('FOREIGN KEY')
    expect(sql).not.toMatch(/\bCREATE(\s+UNIQUE)?\s+INDEX\b/)
  })

  it('rejects relationships with mismatched column lists', () => {
    expect(() =>
      formatDbDiagramSql({
        version: 1,
        tables: [
          { id: 'users', name: 'users', columns: [{ id: 'id', name: 'id', type: 'uuid' }] },
          { id: 'orders', name: 'orders', columns: [{ id: 'user_id', name: 'user_id', type: 'uuid' }] },
        ],
        relationships: [
          {
            id: 'bad',
            sourceTableId: 'orders',
            sourceColumnIds: ['user_id'],
            targetTableId: 'users',
            targetColumnIds: [],
          },
        ],
      }),
    ).toThrow('Relationship bad must reference the same non-zero number of source and target columns')
  })

  it('preserves falsy defaults and safe function dollar quoting', () => {
    const sql = formatDbDiagramSql({
      version: 1,
      domains: [
        {
          id: 'zero-domain',
          name: 'zero_domain',
          type: 'integer',
          defaultValue: '0',
        },
      ],
      tables: [
        {
          id: 'settings',
          name: 'settings',
          columns: [
            { id: 'enabled', name: 'enabled', type: 'boolean', defaultValue: 'FALSE' },
            { id: 'label', name: 'label', type: 'text', defaultValue: "''" },
          ],
        },
      ],
      functions: [
        {
          id: 'echo',
          name: 'echo_text',
          returns: 'text',
          arguments: [{ name: 'value', type: 'text', defaultValue: "''" }],
          body: "SELECT '$$'::text;",
        },
      ],
    })

    expect(sql).toContain('CREATE DOMAIN "zero_domain" AS integer DEFAULT 0;')
    expect(sql).toContain('"enabled" boolean DEFAULT FALSE')
    expect(sql).toContain('"label" text DEFAULT \'\'')
    expect(sql).toContain('"value" text DEFAULT \'\'')
    expect(sql).toContain('AS $fn1$')
    expect(sql).toContain('$fn1$;')
  })

  it('omits FOR EACH when trigger granularity is unspecified', () => {
    const sql = formatDbDiagramSql({
      version: 1,
      tables: [{ id: 'orders', name: 'orders', columns: [{ id: 'id', name: 'id', type: 'uuid' }] }],
      functions: [{ id: 'touch', name: 'touch_updated_at', returns: 'trigger', body: 'SELECT 1;' }],
      triggers: [
        {
          id: 'orders-touch',
          tableId: 'orders',
          name: 'orders_touch',
          timing: 'before',
          events: ['update'],
          functionId: 'touch',
        },
      ],
    })

    expect(sql).toContain(
      'CREATE TRIGGER "orders_touch" BEFORE UPDATE ON "orders" EXECUTE FUNCTION "touch_updated_at"();',
    )
    expect(sql).not.toContain('FOR EACH')
  })

  it('does not emit schema DDL or schema-qualified names for SQLite', () => {
    const sql = formatDbDiagramSql(
      {
        version: 1,
        dialect: 'sqlite',
        schemas: [{ id: 'public', name: 'public' }],
        tables: [{ id: 'users', schemaId: 'public', name: 'users', columns: [{ id: 'id', name: 'id', type: 'text' }] }],
      },
      { includeEnums: false },
    )

    expect(sql).not.toContain('CREATE SCHEMA')
    expect(sql).toContain('CREATE TABLE "users"')
    expect(sql).not.toContain('"public"."users"')
  })

  it('rejects dialect-specific DDL that cannot be represented safely', () => {
    expect(() =>
      formatDbDiagramSql(
        { ...sampleDbSchemaDiagramDocument, dialect: 'sqlite' },
        {
          includeDomains: false,
          includeEnums: false,
          includeExtensions: false,
          includeFunctions: false,
          includePolicies: false,
          includeSequences: false,
          includeTriggers: false,
          includeViews: false,
        },
      ),
    ).toThrow('SQLite export cannot add foreign key constraints after table creation')

    expect(() => formatDbDiagramSql({ ...sampleDbSchemaDiagramDocument, dialect: 'mysql' })).toThrow(
      'Extension DDL export is only supported for PostgreSQL: mysql',
    )

    expect(() =>
      formatDbDiagramSql(
        {
          version: 1,
          dialect: 'mysql',
          tables: [],
          views: [{ id: 'metrics', name: 'metrics', kind: 'materialized-view', definition: 'SELECT 1' }],
        },
        { includeExtensions: false },
      ),
    ).toThrow('Materialized view DDL export is only supported for PostgreSQL: mysql')

    expect(() =>
      formatDbDiagramSql({
        version: 1,
        dialect: 'mysql',
        tables: [
          {
            id: 'users',
            name: 'users',
            columns: [{ id: 'email', name: 'email', type: 'text' }],
            indexes: [{ id: 'email_partial', columnIds: ['email'], predicate: 'email IS NOT NULL' }],
          },
        ],
      }),
    ).toThrow('Index email_partial uses a predicate, which is not supported by MySQL export')
  })
})
