import type { AutoFormUiSchema, JsonSchemaNode } from '@incmix/core'

export const autoformUiSchemaJsonSchema: JsonSchemaNode = {
  type: 'object',
  required: ['country', 'startAt'],
  properties: {
    country: {
      type: 'string',
      enum: ['US', 'CA', 'MX'],
    },
    startAt: {
      type: 'string',
      format: 'date-time',
    },
    notes: {
      type: 'string',
    },
  },
}

export const autoformUiSchemaUiSchema: AutoFormUiSchema = {
  wrapper: 'dialog',
  sections: [
    {
      id: 'trip-details',
      title: 'Trip details',
      fields: ['country', 'startAt', 'notes'],
      columns: 2,
    },
  ],
  fields: {
    country: {
      widget: 'country-picker',
      label: 'Country',
      help: 'Use the native country picker instead of a plain enum select.',
    },
    startAt: {
      widget: 'date-time-picker',
      label: 'Departure',
      colSpan: 2,
    },
    notes: {
      widget: 'textarea',
      colSpan: 2,
      placeholder: 'Optional trip notes',
    },
  },
}

export const autoformUiSchemaOrderedJsonSchema: JsonSchemaNode = {
  type: 'object',
  properties: {
    country: {
      type: 'string',
    },
    startAt: {
      type: 'string',
      format: 'date-time',
    },
    notes: {
      type: 'string',
    },
  },
}

export const autoformUiSchemaOrderedUiSchema: AutoFormUiSchema = {
  fields: {
    notes: {
      label: 'Notes',
      widget: 'textarea',
      order: 1,
    },
    country: {
      label: 'Country',
      widget: 'country-picker',
      order: 2,
    },
    startAt: {
      label: 'Departure',
      widget: 'date-time-picker',
      order: 3,
    },
  },
}

export const autoformLayoutGridJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Traveler profile',
  description: 'AutoForm native layout-grid example using sections, columns, and field colSpan.',
  required: ['firstName', 'lastName', 'email', 'country'],
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    country: {
      type: 'string',
      enum: ['US', 'CA', 'MX'],
    },
    departureAt: {
      type: 'string',
      format: 'date-time',
    },
    includeInsurance: {
      type: 'boolean',
      default: false,
    },
    notes: {
      type: 'string',
    },
  },
}

export const autoformLayoutGridUiSchema: AutoFormUiSchema = {
  wrapper: 'dialog',
  sections: [
    {
      id: 'traveler-profile',
      title: 'Traveler profile',
      fields: ['firstName', 'lastName', 'email', 'country', 'departureAt', 'includeInsurance', 'notes'],
      columns: { base: 1, md: 2 },
    },
  ],
  fields: {
    firstName: {
      label: 'First name',
      placeholder: 'Ada',
    },
    lastName: {
      label: 'Last name',
      placeholder: 'Lovelace',
    },
    email: {
      label: 'Email',
      placeholder: 'ada@example.com',
      colSpan: 2,
    },
    country: {
      widget: 'country-picker',
      label: 'Destination country',
    },
    departureAt: {
      widget: 'date-time-picker',
      label: 'Departure',
    },
    includeInsurance: {
      label: 'Include travel insurance',
      colSpan: 2,
      help: 'Boolean rows can still span the full section width.',
    },
    notes: {
      widget: 'textarea',
      label: 'Notes',
      placeholder: 'Accessibility, seating, or arrival notes',
      colSpan: 2,
    },
  },
}

export const autoformRendererJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Create trip',
  description: 'Native renderer spike using the normalized AutoForm model.',
  required: ['country', 'startAt', 'travelClass'],
  properties: {
    traveler: {
      type: 'object',
      required: ['fullName', 'email'],
      properties: {
        fullName: {
          type: 'string',
        },
        email: {
          type: 'string',
          format: 'email',
        },
      },
    },
    country: {
      type: 'string',
      enum: ['US', 'CA', 'MX'],
    },
    startAt: {
      type: 'string',
      format: 'date-time',
    },
    travelClass: {
      type: 'string',
      enum: ['economy', 'premium', 'business'],
      default: 'economy',
    },
    includeInsurance: {
      type: 'boolean',
      default: false,
    },
    notes: {
      type: 'string',
    },
  },
}

export const autoformRendererUiSchema: AutoFormUiSchema = {
  wrapper: 'dialog',
  sections: [
    {
      id: 'trip-details',
      title: 'Trip details',
      fields: ['traveler', 'country', 'startAt', 'travelClass', 'includeInsurance', 'notes'],
      columns: 2,
    },
  ],
  fields: {
    traveler: {
      label: 'Traveler information',
      colSpan: 2,
    },
    'traveler.fullName': {
      label: 'Full name',
      placeholder: 'Traveler full name',
    },
    'traveler.email': {
      label: 'Email address',
      placeholder: 'name@example.com',
    },
    country: {
      widget: 'country-picker',
      label: 'Destination country',
      help: 'Uses the native country picker instead of a plain enum select.',
    },
    startAt: {
      widget: 'date-time-picker',
      label: 'Departure',
    },
    travelClass: {
      label: 'Travel class',
      help: 'Default enum/select handling comes from the normalized model.',
    },
    includeInsurance: {
      label: 'Include travel insurance',
      help: 'Boolean fields render natively as checkbox rows.',
    },
    notes: {
      widget: 'textarea',
      label: 'Notes',
      placeholder: 'Seat preference, accessibility needs, or arrival notes',
      colSpan: 2,
    },
  },
}

export const autoformResponsiveRendererUiSchema: AutoFormUiSchema = {
  wrapper: 'dialog',
  sections: [
    {
      id: 'trip-details',
      title: 'Trip details',
      fields: ['traveler', 'country', 'startAt', 'travelClass', 'includeInsurance', 'notes'],
      columns: { base: 1, md: 2 },
    },
  ],
  fields: {
    ...autoformRendererUiSchema.fields,
    traveler: {
      label: 'Traveler information',
      colSpan: { base: 1, md: 2 },
    },
    notes: {
      widget: 'textarea',
      label: 'Notes',
      placeholder: 'Seat preference, accessibility needs, or arrival notes',
      colSpan: { base: 1, md: 2 },
    },
  },
}

export const autoformResponsiveWorkspaceJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Workspace profile',
  description: 'Demonstrates a richer responsive layout with multiple sections.',
  required: ['firstName', 'lastName', 'email', 'country', 'timezone', 'travelRole'],
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    country: {
      type: 'string',
      enum: ['US', 'CA', 'MX'],
    },
    timezone: {
      type: 'string',
      enum: ['PST', 'MST', 'CST', 'EST'],
      default: 'PST',
    },
    travelRole: {
      type: 'string',
      enum: ['reviewer', 'approver', 'traveler'],
      default: 'traveler',
    },
    reviewAt: {
      type: 'string',
      format: 'date-time',
    },
    includeInsurance: {
      type: 'boolean',
      default: false,
    },
    notes: {
      type: 'string',
    },
  },
}

export const autoformResponsiveWorkspaceUiSchema: AutoFormUiSchema = {
  wrapper: 'dialog',
  sections: [
    {
      id: 'profile',
      title: 'Profile',
      fields: ['firstName', 'lastName', 'email', 'country', 'timezone'],
      columns: { base: 1, md: 2, xl: 3 },
    },
    {
      id: 'travel-setup',
      title: 'Travel setup',
      fields: ['travelRole', 'reviewAt', 'includeInsurance', 'notes'],
      columns: { base: 1, md: 2, xl: 3 },
    },
  ],
  fields: {
    firstName: {
      label: 'First name',
      placeholder: 'Avery',
    },
    lastName: {
      label: 'Last name',
      placeholder: 'Nguyen',
    },
    email: {
      label: 'Email',
      placeholder: 'avery@example.com',
    },
    country: {
      widget: 'country-picker',
      label: 'Country',
      help: 'Country picker stays full-width inside the responsive grid cell.',
    },
    timezone: {
      label: 'Timezone',
    },
    travelRole: {
      label: 'Travel role',
      help: 'Default enum/select fields should reflow with the section grid.',
    },
    reviewAt: {
      widget: 'date-time-picker',
      label: 'Review meeting',
    },
    includeInsurance: {
      label: 'Include insurance',
      help: 'Boolean rows should still align inside responsive sections.',
    },
    notes: {
      widget: 'textarea',
      label: 'Notes',
      placeholder: 'Escalation path, policy notes, or preferred vendors',
      colSpan: { base: 1, md: 2, xl: 3 },
    },
  },
}

export const autoformStepperJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Traveler onboarding',
  description: 'Section-driven AutoForm stepper flow.',
  required: ['firstName', 'email', 'country', 'reviewAt'],
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    country: {
      type: 'string',
      enum: ['US', 'CA', 'MX'],
    },
    reviewAt: {
      type: 'string',
      format: 'date-time',
    },
    includeInsurance: {
      type: 'boolean',
      default: false,
    },
    notes: {
      type: 'string',
    },
  },
}

export const autoformStepperUiSchema: AutoFormUiSchema = {
  sections: [
    {
      id: 'profile',
      title: 'Profile',
      fields: ['firstName', 'lastName', 'email'],
      columns: 2,
    },
    {
      id: 'travel-setup',
      title: 'Travel setup',
      fields: ['country', 'reviewAt', 'includeInsurance', 'notes'],
      columns: 2,
    },
  ],
  steps: [
    {
      id: 'profile-step',
      title: 'Profile',
      description: 'Basic traveler information',
      sections: ['profile'],
    },
    {
      id: 'travel-step',
      title: 'Travel setup',
      description: 'Destination and review details',
      sections: ['travel-setup'],
    },
  ],
  fields: {
    firstName: {
      label: 'First name',
      placeholder: 'Ada',
    },
    lastName: {
      label: 'Last name',
      placeholder: 'Lovelace',
    },
    email: {
      label: 'Email address',
      placeholder: 'ada@example.com',
    },
    country: {
      widget: 'country-picker',
      label: 'Destination country',
    },
    reviewAt: {
      widget: 'date-time-picker',
      label: 'Review date',
    },
    includeInsurance: {
      label: 'Include travel insurance',
    },
    notes: {
      widget: 'textarea',
      label: 'Notes',
      colSpan: 2,
      placeholder: 'Anything reviewers should know',
    },
  },
}

export const autoformRichWidgetsJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Workspace update',
  description: 'Demonstrates richer widget props for structured selection and autocomplete controls.',
  properties: {
    comment: {
      type: 'string',
    },
    template: {
      type: 'string',
      enum: ['docs', 'security', 'release'],
    },
    assignee: {
      type: 'string',
      enum: ['ada', 'grace', 'lin'],
    },
    reviewers: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['ada', 'grace', 'lin', 'margaret'],
      },
      maxItems: 3,
    },
  },
}

export const autoformRichWidgetsUiSchema: AutoFormUiSchema = {
  fields: {
    comment: {
      widget: 'mention-textarea',
      label: 'Review comment',
      help: 'Mention collaborators with avatar-backed @mentions and multi-select #tags.',
      placeholder: 'Type @ for people or # for tags',
      props: {
        triggers: [
          {
            trigger: '@',
            picker: 'avatar',
            avatarItems: [
              { id: 'ada', name: 'Ada Lovelace', description: 'ada@example.com' },
              { id: 'grace', name: 'Grace Hopper', description: 'grace@example.com' },
              { id: 'lin', name: 'Linus Torvalds', description: 'lin@example.com' },
            ],
          },
          {
            trigger: '#',
            picker: 'multi-select',
            options: [
              { value: 'docs', label: 'Documentation' },
              { value: 'urgent', label: 'Urgent' },
              { value: 'api', label: 'API' },
            ],
            searchable: false,
            placeholder: 'Select tags',
          },
        ],
        toolbar: true,
        rows: 4,
      },
    },
    template: {
      widget: 'autocomplete',
      label: 'Review template',
      help: 'Single-value autocomplete uses the reusable form Combobox.',
      placeholder: 'Choose template',
      props: {
        options: [
          { value: 'docs', label: 'Documentation review' },
          { value: 'security', label: 'Security review' },
          { value: 'release', label: 'Release review' },
        ],
      },
    },
    assignee: {
      widget: 'avatar-picker',
      label: 'Assignee',
      help: 'Single-value avatar selection uses structured item props.',
      placeholder: 'Choose assignee',
      props: {
        items: [
          { id: 'ada', name: 'Ada Lovelace', description: 'ada@example.com' },
          { id: 'grace', name: 'Grace Hopper', description: 'grace@example.com' },
          { id: 'lin', name: 'Linus Torvalds', description: 'lin@example.com' },
        ],
      },
    },
    reviewers: {
      widget: 'multi-select',
      label: 'Reviewers',
      help: 'Array-of-string fields can opt into multi-select instead of repeater rows.',
      placeholder: 'Select reviewers',
      props: {
        options: [
          { value: 'ada', label: 'Ada Lovelace' },
          { value: 'grace', label: 'Grace Hopper' },
          { value: 'lin', label: 'Linus Torvalds' },
          { value: 'margaret', label: 'Margaret Hamilton' },
        ],
        searchable: false,
        maxVisibleBadges: 2,
      },
    },
  },
}

export const autoformSelectionAndScheduleJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Review workflow',
  description:
    'Exercises avatar, location, date, time, date-time, and numeric widgets through the native AutoForm renderer.',
  required: ['assignee', 'country', 'kickoffDate', 'reviewAt'],
  properties: {
    assignee: {
      type: 'string',
      enum: ['ada', 'grace', 'lin'],
    },
    country: {
      type: 'string',
      enum: ['US', 'CA', 'MX'],
    },
    kickoffDate: {
      type: 'string',
      format: 'date',
    },
    reviewAt: {
      type: 'string',
      format: 'date-time',
    },
    reviewTime: {
      type: 'string',
      format: 'time',
    },
    reviewerSeats: {
      type: 'integer',
    },
    notes: {
      type: 'string',
    },
  },
}

export const autoformSelectionAndScheduleUiSchema: AutoFormUiSchema = {
  sections: [
    {
      id: 'assignment',
      title: 'Assignment',
      fields: ['assignee', 'country', 'kickoffDate', 'reviewAt', 'reviewTime', 'reviewerSeats', 'notes'],
      columns: { base: 1, md: 2 },
    },
  ],
  fields: {
    assignee: {
      widget: 'avatar-picker',
      label: 'Assignee',
      help: 'Structured avatar selection through the AutoForm widget contract.',
      props: {
        placeholder: 'Choose assignee',
        searchPlaceholder: 'Search reviewers',
        items: [
          { id: 'ada', name: 'Ada Lovelace', description: 'ada@example.com', hoverCard: true },
          { id: 'grace', name: 'Grace Hopper', description: 'grace@example.com', hoverCard: true },
          { id: 'lin', name: 'Linus Torvalds', description: 'lin@example.com', hoverCard: true },
        ],
      },
    },
    country: {
      widget: 'country-picker',
      label: 'Deployment country',
      help: 'Location input should compose through the same normalized widget contract.',
      props: {
        defaultCountry: 'US',
        countryPlaceholder: 'Select country',
        size: 'sm',
        radius: 'lg',
        color: 'primary',
      },
    },
    kickoffDate: {
      widget: 'date-picker',
      label: 'Kickoff date',
      props: {
        placeholder: 'Pick kickoff date',
        enableNaturalLanguage: true,
        size: 'sm',
        radius: 'lg',
      },
    },
    reviewAt: {
      widget: 'date-time-picker',
      label: 'Review date & time',
      props: {
        size: 'sm',
        color: 'primary',
        showSeconds: true,
        minuteStep: 15,
      },
    },
    reviewTime: {
      label: 'Review time',
      props: {
        minuteStep: 15,
        use12HourFormat: true,
      },
    },
    reviewerSeats: {
      label: 'Reviewer seats',
      props: {
        min: 1,
        max: 5,
        allowDecimal: false,
      },
    },
    notes: {
      widget: 'textarea',
      label: 'Notes',
      placeholder: 'Capture rollout notes or reviewer context',
      colSpan: { base: 1, md: 2 },
    },
  },
}

export const autoformStepperSelectionAndScheduleJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Release review setup',
  required: ['assignee', 'country', 'kickoffDate', 'reviewAt'],
  properties: {
    assignee: {
      type: 'string',
      enum: ['ada', 'grace', 'lin'],
    },
    country: {
      type: 'string',
      enum: ['US', 'CA', 'MX'],
    },
    kickoffDate: {
      type: 'string',
      format: 'date',
    },
    reviewAt: {
      type: 'string',
      format: 'date-time',
    },
    notes: {
      type: 'string',
    },
  },
}

export const autoformStepperSelectionAndScheduleUiSchema: AutoFormUiSchema = {
  sections: [
    {
      id: 'ownership',
      title: 'Ownership',
      fields: ['assignee', 'country'],
      columns: { base: 1, md: 2 },
    },
    {
      id: 'schedule',
      title: 'Schedule',
      fields: ['kickoffDate', 'reviewAt', 'notes'],
      columns: { base: 1, md: 2 },
    },
  ],
  steps: [
    {
      id: 'ownership-step',
      title: 'Ownership',
      description: 'Pick the reviewer and target country first.',
      sections: ['ownership'],
    },
    {
      id: 'schedule-step',
      title: 'Schedule',
      description: 'Then define the kickoff and review schedule.',
      sections: ['schedule'],
    },
  ],
  fields: autoformSelectionAndScheduleUiSchema.fields,
}

export const autoformWrapperSupportedWidgetsJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Wrapper-supported widgets',
  description: 'Shows the subset of AutoForm widget intent that composes through the DialogWrapper adapter today.',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
    website: {
      type: 'string',
      format: 'url',
    },
    notes: {
      type: 'string',
    },
  },
}

export const autoformWrapperSupportedWidgetsUiSchema: AutoFormUiSchema = {
  wrapper: 'dialog',
  sections: [
    {
      id: 'wrapper-supported',
      title: 'Wrapper-supported controls',
      fields: ['email', 'password', 'website', 'notes'],
      columns: 2,
    },
  ],
  fields: {
    email: {
      widget: 'email',
      label: 'Email',
      placeholder: 'ada@example.com',
    },
    password: {
      widget: 'password',
      label: 'Password',
      placeholder: 'Enter password',
    },
    website: {
      widget: 'url',
      label: 'Website',
      placeholder: 'https://example.com',
    },
    notes: {
      widget: 'textarea',
      label: 'Notes',
      placeholder: 'Wrapper path preserves textarea/email/password/url today.',
      colSpan: 2,
    },
  },
}

export const autoformStepperFileUploadJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Release package',
  description: 'Stepper flow that includes file upload before final review.',
  required: ['releaseName'],
  properties: {
    releaseName: {
      type: 'string',
    },
    summary: {
      type: 'string',
    },
    attachments: {
      type: 'array',
      minItems: 1,
      maxItems: 3,
      items: {
        type: 'string',
      },
    },
    notifyTeam: {
      type: 'boolean',
      default: true,
    },
  },
}

export const autoformStepperFileUploadUiSchema: AutoFormUiSchema = {
  sections: [
    {
      id: 'release-details',
      title: 'Release details',
      fields: ['releaseName', 'summary'],
      columns: 1,
    },
    {
      id: 'artifacts',
      title: 'Artifacts',
      fields: ['attachments'],
      columns: 1,
    },
    {
      id: 'review',
      title: 'Review',
      fields: ['notifyTeam'],
      columns: 1,
    },
  ],
  steps: [
    {
      id: 'details-step',
      title: 'Details',
      description: 'Name the release and add a short summary.',
      sections: ['release-details'],
    },
    {
      id: 'artifacts-step',
      title: 'Artifacts',
      description: 'Upload at least one asset before continuing.',
      sections: ['artifacts'],
    },
    {
      id: 'review-step',
      title: 'Review',
      description: 'Choose the final notification setting and submit.',
      sections: ['review'],
    },
  ],
  fields: {
    releaseName: {
      label: 'Release name',
      placeholder: 'March 2026 launch',
    },
    summary: {
      widget: 'textarea',
      label: 'Summary',
      placeholder: 'What changed in this release?',
    },
    attachments: {
      widget: 'file-upload',
      label: 'Assets',
      help: 'Upload screenshots, PDFs, or release notes before continuing.',
      placeholder: 'Drop artifacts here, or click to browse',
      props: {
        accept: {
          'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
          'application/pdf': ['.pdf'],
        },
        maxSize: 10 * 1024 * 1024,
        variant: 'minimal',
      },
    },
    notifyTeam: {
      label: 'Notify team after publishing',
      help: 'Final review step still uses the standard boolean row.',
    },
  },
}

export const autoformFileUploadJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Release assets',
  description: 'Demonstrates file-upload as an AutoForm array widget.',
  properties: {
    attachments: {
      type: 'array',
      items: {
        type: 'string',
      },
      maxItems: 3,
    },
  },
}

export const autoformFileUploadUiSchema: AutoFormUiSchema = {
  fields: {
    attachments: {
      widget: 'file-upload',
      label: 'Attachments',
      help: 'Upload supporting images or PDFs. AutoForm stores the FileUpload value as UploadedFile[].',
      placeholder: 'Drop files here, or click to browse',
      props: {
        accept: {
          'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
          'application/pdf': ['.pdf'],
        },
        maxSize: 10 * 1024 * 1024,
        size: 'xs',
        radius: 'lg',
        showStatusSections: true,
        variant: 'minimal',
      },
    },
  },
}

export const autoformDateRulesJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Policy dates',
  description: 'Demonstrates first-class past/future, absolute bounds, and age rules.',
  required: ['birthDate', 'activationDate', 'reviewBy'],
  properties: {
    birthDate: {
      type: 'string',
      format: 'date',
      '$autoform:dateRules': {
        minAge: 18,
      },
    },
    activationDate: {
      type: 'string',
      format: 'date',
      '$autoform:dateRules': {
        mode: 'future',
      },
    },
    reviewBy: {
      type: 'string',
      format: 'date-time',
      '$autoform:dateRules': {
        minDate: '2026-04-01T09:00:00.000Z',
        maxDate: '2026-04-30T18:00:00.000Z',
      },
    },
  },
}

export const autoformDateRulesUiSchema: AutoFormUiSchema = {
  sections: [
    {
      id: 'policy-dates',
      title: 'Policy dates',
      fields: ['birthDate', 'activationDate', 'reviewBy'],
      columns: 1,
    },
  ],
  fields: {
    birthDate: {
      widget: 'date-picker',
      label: 'Birth date',
      help: 'Must be at least 18 years old.',
    },
    activationDate: {
      widget: 'date-picker',
      label: 'Activation date',
      help: 'Future-only date rule maps to picker bounds and submit validation.',
    },
    reviewBy: {
      widget: 'date-time-picker',
      label: 'Review by',
      help: 'Date-time bounds use the same source of truth as runtime validation.',
    },
  },
}

export const autoformSimpleDateRulesJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Appointment dates',
  description: 'Simpler date-rules example focused on a single future-only appointment field.',
  required: ['birthDate', 'appointmentDate'],
  properties: {
    birthDate: {
      type: 'string',
      format: 'date',
      '$autoform:dateRules': {
        minAge: 18,
      },
    },
    appointmentDate: {
      type: 'string',
      format: 'date-time',
      '$autoform:dateRules': {
        mode: 'future',
      },
    },
  },
}

export const autoformSimpleDateRulesUiSchema: AutoFormUiSchema = {
  fields: {
    birthDate: {
      widget: 'date-picker',
      label: 'Birth date',
    },
    appointmentDate: {
      widget: 'date-time-picker',
      label: 'Appointment date',
    },
  },
}

export const autoformResponsiveHorizontalUiSchema: AutoFormUiSchema = {
  wrapper: 'dialog',
  sections: [
    {
      id: 'traveler-profile',
      title: 'Traveler profile',
      fields: ['firstName', 'lastName', 'email', 'country', 'timezone', 'notes'],
      columns: { base: 1, md: 2 },
      layout: { base: 'stacked', lg: 'horizontal' },
      labelPlacement: { base: 'top', lg: 'start' },
    },
  ],
  fields: {
    firstName: {
      label: 'First name',
      placeholder: 'Avery',
    },
    lastName: {
      label: 'Last name',
      placeholder: 'Nguyen',
    },
    email: {
      label: 'Email',
      placeholder: 'avery@example.com',
    },
    country: {
      widget: 'country-picker',
      label: 'Country',
    },
    timezone: {
      label: 'Timezone',
    },
    notes: {
      widget: 'textarea',
      label: 'Notes',
      placeholder: 'Escalation path, policy notes, or preferred vendors',
      colSpan: { base: 1, md: 2 },
    },
  },
}

export const autoformBooleanLayoutUiSchema: AutoFormUiSchema = {
  wrapper: 'dialog',
  sections: [
    {
      id: 'preferences',
      title: 'Preferences',
      fields: ['travelClass', 'includeInsurance', 'reviewAt', 'notes'],
      columns: { base: 1, md: 2 },
    },
  ],
  fields: {
    travelClass: {
      label: 'Travel class',
    },
    includeInsurance: {
      label: 'Include travel insurance',
      help: 'Boolean rows stay inline by default, but can opt into stacked layout.',
      layout: 'stacked',
    },
    reviewAt: {
      widget: 'date-time-picker',
      label: 'Review meeting',
    },
    notes: {
      widget: 'textarea',
      label: 'Notes',
      colSpan: { base: 1, md: 2 },
    },
  },
}

export const autoformConditionalJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Account details',
  description: 'Demonstrates runtime condition evaluation over existing normalized fields.',
  required: ['accountType'],
  properties: {
    accountType: {
      type: 'string',
      enum: ['individual', 'business'],
      default: 'individual',
    },
    companyName: {
      type: 'string',
    },
    nickname: {
      type: 'string',
    },
    approvalCode: {
      type: 'string',
    },
    includeInsurance: {
      type: 'boolean',
      default: false,
    },
  },
  if: {
    properties: {
      accountType: {
        const: 'business',
      },
    },
    required: ['accountType'],
  },
  // biome-ignore lint/suspicious/noThenProperty: JSON Schema fixtures legitimately use then/else keys.
  then: {
    required: ['companyName'],
    properties: {
      companyName: {
        'ui:hidden': false,
      },
      nickname: {
        'ui:hidden': true,
      },
      approvalCode: {
        readOnly: true,
      },
      includeInsurance: {
        'ui:hidden': true,
      },
    },
  },
  else: {
    required: ['nickname'],
    properties: {
      companyName: {
        'ui:hidden': true,
      },
      nickname: {
        'ui:hidden': false,
      },
      approvalCode: {
        readOnly: false,
      },
      includeInsurance: {
        'ui:hidden': false,
      },
    },
  },
}

export const autoformConditionalUiSchema: AutoFormUiSchema = {
  fields: {
    accountType: {
      label: 'Account type',
    },
    companyName: {
      label: 'Company name',
      placeholder: 'Acme Inc.',
      help: 'Shown and required for business accounts.',
    },
    nickname: {
      label: 'Nickname',
      placeholder: 'How should we address you?',
      help: 'Shown and required for individual accounts.',
    },
    approvalCode: {
      label: 'Approval code',
      placeholder: 'Issued by operations',
      help: 'Becomes read-only for business accounts.',
    },
    includeInsurance: {
      label: 'Include account insurance',
      help: 'Shown for individual accounts and hidden for business accounts.',
    },
  },
}

export const autoformDynamicBranchJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Account branch materialization',
  description: 'Demonstrates branch-only fields that are introduced by conditional schemas.',
  required: ['accountType'],
  properties: {
    accountType: {
      type: 'string',
      enum: ['individual', 'business'],
      default: 'individual',
    },
  },
  if: {
    properties: {
      accountType: {
        const: 'business',
      },
    },
    required: ['accountType'],
  },
  // biome-ignore lint/suspicious/noThenProperty: JSON Schema fixtures legitimately use then/else keys.
  then: {
    required: ['vatId'],
    properties: {
      vatId: {
        type: 'string',
      },
    },
  },
  else: {
    properties: {
      nickname: {
        type: 'string',
      },
    },
  },
}

export const autoformDynamicBranchUiSchema: AutoFormUiSchema = {
  sections: [
    {
      id: 'account',
      title: 'Account',
      fields: ['accountType', 'vatId', 'nickname'],
      columns: 1,
    },
  ],
  fields: {
    accountType: {
      label: 'Account type',
      help: 'Switching this field materializes branch-only controls into the normalized renderer output.',
    },
    vatId: {
      label: 'VAT ID',
      placeholder: 'EU-42',
      help: 'This field only exists on the business branch.',
    },
    nickname: {
      label: 'Nickname',
      placeholder: 'Ada',
      help: 'This field only exists on the individual branch.',
    },
  },
}

export const autoformRepeaterBranchJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Dependent branch materialization',
  description: 'Demonstrates branch-only fields inside array item scopes.',
  properties: {
    dependents: {
      type: 'array',
      items: {
        type: 'object',
        required: ['relationship'],
        properties: {
          relationship: {
            type: 'string',
            enum: ['individual', 'business'],
          },
        },
        if: {
          properties: {
            relationship: {
              const: 'business',
            },
          },
          required: ['relationship'],
        },
        // biome-ignore lint/suspicious/noThenProperty: JSON Schema fixtures legitimately use then/else keys.
        then: {
          properties: {
            vatId: {
              type: 'string',
            },
          },
        },
        else: {
          properties: {
            nickname: {
              type: 'string',
            },
          },
        },
      },
    },
  },
}

export const autoformRepeaterBranchUiSchema: AutoFormUiSchema = {
  sections: [
    {
      id: 'dependents',
      title: 'Dependents',
      fields: ['dependents'],
      columns: 1,
    },
  ],
  fields: {
    dependents: {
      label: 'Dependents',
      help: 'Each repeater item evaluates its own conditional branch independently.',
    },
    'dependents[*].relationship': {
      label: 'Relationship',
    },
    'dependents[*].vatId': {
      label: 'VAT ID',
      placeholder: 'EU-42',
    },
    'dependents[*].nickname': {
      label: 'Nickname',
      placeholder: 'Ada',
    },
  },
}

export const autoformArrayRepeaterJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Trip roster',
  description: 'Demonstrates native tag input rendering for string arrays and repeater rendering for object arrays.',
  properties: {
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    dependents: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          relationship: {
            type: 'string',
          },
          notes: {
            type: 'string',
          },
        },
      },
    },
  },
}

export const autoformArrayRepeaterUiSchema: AutoFormUiSchema = {
  sections: [
    {
      id: 'trip-roster',
      title: 'Trip roster',
      fields: ['tags', 'dependents'],
      columns: 1,
    },
  ],
  fields: {
    tags: {
      label: 'Travel tags',
      help: 'String arrays render as a creatable tag input by default.',
    },
    dependents: {
      label: 'Dependents',
      help: 'Array items can also render nested object groups with their own fields.',
    },
    'dependents[*].name': {
      label: 'Name',
      placeholder: 'Dependent name',
    },
    'dependents[*].relationship': {
      label: 'Relationship',
      placeholder: 'Spouse, child, parent',
    },
    'dependents[*].notes': {
      widget: 'textarea',
      label: 'Notes',
      placeholder: 'Accessibility needs, passport notes, or seat preferences',
    },
  },
}

export const autoformConstrainedRepeaterJsonSchema: JsonSchemaNode = {
  type: 'object',
  title: 'Household roster',
  description: 'Demonstrates repeater min/max constraints together with row reordering.',
  properties: {
    dependents: {
      type: 'array',
      minItems: 1,
      maxItems: 2,
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          relationship: {
            type: 'string',
          },
        },
      },
    },
  },
}

export const autoformConstrainedRepeaterUiSchema: AutoFormUiSchema = {
  sections: [
    {
      id: 'household-roster',
      title: 'Household roster',
      fields: ['dependents'],
      columns: 1,
    },
  ],
  fields: {
    dependents: {
      label: 'Dependents',
      help: 'Requires 1-2 dependents and supports moving rows before submit.',
    },
    'dependents[*].name': {
      label: 'Name',
      placeholder: 'Dependent name',
    },
    'dependents[*].relationship': {
      label: 'Relationship',
      placeholder: 'Spouse, child, parent',
    },
  },
}
