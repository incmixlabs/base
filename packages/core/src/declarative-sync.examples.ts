import type {
  DeclarativeSyncAppRecord,
  DeclarativeSyncPageRecord,
  DeclarativeSyncPullRequest,
  DeclarativeSyncPullResponse,
  DeclarativeSyncPushRequest,
  DeclarativeSyncPushResponse,
} from './declarative-sync-boundary'
import { declarativeUiGrammarPressureApp } from './declarative-ui.examples'

const SUPPORT_DASHBOARD_PAGE_ID = 'support.dashboard'
const SUPPORT_DASHBOARD_PAGE_TITLE = 'Support Dashboard'
const SUPPORT_APP_ID = 'support.app'
const SUPPORT_APP_TITLE = 'Support App'

function buildSupportDashboardPageRecord(
  revision: string,
  updatedAt: string,
  template: string,
): DeclarativeSyncPageRecord {
  return {
    documentKind: 'page',
    id: SUPPORT_DASHBOARD_PAGE_ID,
    revision,
    title: SUPPORT_DASHBOARD_PAGE_TITLE,
    updatedAt,
    document: {
      kind: 'page',
      id: SUPPORT_DASHBOARD_PAGE_ID,
      title: SUPPORT_DASHBOARD_PAGE_TITLE,
      root: {
        type: 'layout',
        props: {
          direction: 'vertical',
          gap: 12,
        },
        children: [
          {
            type: 'template',
            props: {
              template,
            },
          },
        ],
      },
    },
  }
}

function buildSupportAppRecord(revision: string, updatedAt: string): DeclarativeSyncAppRecord {
  return {
    documentKind: 'app',
    id: SUPPORT_APP_ID,
    revision,
    title: SUPPORT_APP_TITLE,
    updatedAt,
    document: {
      ...structuredClone(declarativeUiGrammarPressureApp),
      id: SUPPORT_APP_ID,
      title: SUPPORT_APP_TITLE,
    },
  }
}

export const declarativeSyncPullPagesExampleRequest: DeclarativeSyncPullRequest = {
  documentKind: 'page',
  sinceCursor: 'cursor:sync:101',
  limit: 50,
}

export const declarativeSyncPullPagesExampleResponse: DeclarativeSyncPullResponse = {
  changes: [
    {
      operation: 'upsert',
      record: buildSupportDashboardPageRecord('rev_remote_12', '2026-04-11T09:15:00.000Z', 'Support Controls'),
      baseRevision: 'rev_remote_11',
      source: 'worker',
    },
  ],
  nextCursor: 'cursor:sync:102',
  hasMore: false,
}

export const declarativeSyncPushPagesExampleRequest: DeclarativeSyncPushRequest = {
  changes: [
    {
      operation: 'upsert',
      record: buildSupportDashboardPageRecord('rev_local_21', '2026-04-11T09:20:00.000Z', 'Updated Support Controls'),
      baseRevision: 'rev_remote_12',
      source: 'same-tab',
    },
  ],
}

export const declarativeSyncPushPagesExampleResponse: DeclarativeSyncPushResponse = {
  applied: [
    {
      documentKind: 'page',
      id: SUPPORT_DASHBOARD_PAGE_ID,
      revision: 'rev_remote_13',
    },
  ],
  conflicts: [],
  acceptedCursor: 'cursor:sync:103',
}

export const declarativeSyncPushConflictExampleResponse: DeclarativeSyncPushResponse = {
  applied: [],
  conflicts: [
    {
      reason: 'revision-mismatch',
      document: {
        documentKind: 'page',
        id: SUPPORT_DASHBOARD_PAGE_ID,
        revision: 'rev_local_21',
      },
      serverRecord: buildSupportDashboardPageRecord(
        'rev_remote_14',
        '2026-04-11T09:25:00.000Z',
        'Remote Dashboard Revision',
      ),
      message: 'Server revision has advanced since the client based its local edit on rev_remote_12.',
    },
  ],
}

export const declarativeSyncPullAppsExampleResponse: DeclarativeSyncPullResponse = {
  changes: [
    {
      operation: 'upsert',
      record: buildSupportAppRecord('rev_remote_app_2', '2026-04-11T09:30:00.000Z'),
      baseRevision: 'rev_remote_app_1',
      source: 'worker',
    },
  ],
  nextCursor: 'cursor:sync:202',
  hasMore: false,
}
