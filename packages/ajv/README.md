# @incmix/ajv

AJV (Another JSON Schema Validator) provider for AutoForm.

## Installation

```bash
npm install @incmix/ajv ajv
```

## Usage

```typescript
import { AjvProvider } from "@incmix/ajv";
import type { JSONSchemaType } from "ajv";

interface FormData {
  name: string;
  email: string;
  age: number;
  subscribe: boolean;
}

const schema: JSONSchemaType<FormData> = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Your full name",
    },
    email: {
      type: "string",
      format: "email",
      description: "Your email address",
    },
    age: {
      type: "number",
      minimum: 0,
      maximum: 120,
      description: "Your age",
    },
    subscribe: {
      type: "boolean",
      default: false,
      description: "Subscribe to newsletter",
    },
  },
  required: ["name", "email", "age"],
};

const provider = new AjvProvider(schema);

// Use with AutoForm
<AutoForm provider={provider} onSubmit={handleSubmit} />
```

## Field Configuration

You can add AutoForm-specific field configuration using the `withFieldConfig` helper:

```typescript
import { withFieldConfig, createField } from "@incmix/ajv";

const schema = {
  type: "object",
  properties: {
    name: withFieldConfig(
      { type: "string" },
      {
        label: "Full Name",
        fieldType: "text",
        order: 1,
      },
    ),
    role: createField(
      {
        type: "string",
        enum: ["admin", "user", "guest"],
      },
      {
        label: "User Role",
        fieldType: "select",
      },
    ),
  },
};
```

## Advanced Usage

### Custom AJV Options

You can pass custom AJV options to the provider:

```typescript
const provider = new AjvProvider(schema, {
  coerceTypes: true,
  removeAdditional: true,
  useDefaults: true,
});
```

### Complex Schemas

The provider supports complex JSON schemas including:

- Nested objects
- Arrays
- Conditional schemas (anyOf, oneOf, allOf)
- Runtime-generated schemas with `$defs` and `$ref`
- Format validation (email, date, uri, etc.)
- Custom validation keywords

```typescript
const complexSchema: JSONSchemaType<ComplexForm> = {
  type: "object",
  properties: {
    user: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
      },
      required: ["name", "email"],
    },
    tags: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 5,
    },
    preferences: {
      anyOf: [
        { type: "string" },
        {
          type: "object",
          properties: {
            theme: { type: "string", enum: ["light", "dark"] },
            language: { type: "string" },
          },
        },
      ],
    },
  },
};
```

## Dynamic Schemas

If your form definition is assembled at runtime, keep the JSON Schema as the source of truth and build it with plain TypeScript.

```typescript
import { AjvProvider } from "@incmix/ajv";

type Variant = "individual" | "business";

function createSignupSchema(variant: Variant) {
  return {
    $id: `schema:signup:${variant}`,
    type: "object",
    required: ["accountType", "profile"],
    $defs: {
      profile: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
          locale: { type: "string", default: "en-US" },
        },
      },
    },
    properties: {
      accountType: {
        type: "string",
        const: variant,
        default: variant,
      },
      profile: { $ref: "#/$defs/profile" },
      ...(variant === "business"
        ? {
            companyName: { type: "string", minLength: 2 },
          }
        : {
            nickname: { type: "string" },
          }),
    },
    if: {
      properties: {
        accountType: { const: "business" },
      },
    },
    then: {
      required: ["companyName"],
    },
  } as const;
}

const provider = new AjvProvider(createSignupSchema("business"), {
  strict: false,
});

const result = provider.validateSchema({
  accountType: "business",
  companyName: "Boardwalk",
  profile: { email: "ops@boardwalk.test" },
});
```

Recommended split:

- Use `AjvProvider` for validating runtime-generated data against runtime-generated schema.
- Keep UI orchestration outside AJV. Generate steps, sections, and visibility from your own runtime model or AST layer.
- If you need an inspectable form structure, pair AJV with `schemaToAst` from `@incmix/core`.
