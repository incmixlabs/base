import { describe, expect, it } from 'vitest'
import {
  getAutoFormAvatarPickerWidgetProps,
  getAutoFormComboboxWidgetProps,
  getAutoFormCountryPickerWidgetProps,
  getAutoFormDatePickerWidgetProps,
  getAutoFormDateTimePickerWidgetProps,
  getAutoFormFileUploadWidgetProps,
  getAutoFormMentionTextareaWidgetProps,
  getAutoFormMultiSelectWidgetProps,
  getAutoFormTimePickerWidgetProps,
  getAutoFormTreeLeafSelectWidgetProps,
} from './autoform-rich-widgets.props'

describe('getAutoFormFileUploadWidgetProps', () => {
  it('parses the supported file-upload widget props from unknown input', () => {
    expect(
      getAutoFormFileUploadWidgetProps({
        accept: {
          'image/*': ['.png', '.jpg'],
          'application/pdf': ['.pdf'],
        },
        maxSize: 1024,
        maxFiles: 3,
        multiple: false,
        placeholder: 'Drop artifacts here',
        description: 'Upload images or PDFs.',
        showFileList: false,
        showStatusSections: true,
        variant: 'minimal',
        size: 'sm',
        radius: 'lg',
      }),
    ).toEqual({
      accept: {
        'image/*': ['.png', '.jpg'],
        'application/pdf': ['.pdf'],
      },
      maxSize: 1024,
      maxFiles: 3,
      multiple: false,
      placeholder: 'Drop artifacts here',
      description: 'Upload images or PDFs.',
      showFileList: false,
      showStatusSections: true,
      variant: 'minimal',
      size: 'sm',
      radius: 'lg',
    })
  })

  it('drops invalid or unsupported values', () => {
    expect(
      getAutoFormFileUploadWidgetProps({
        accept: {
          'image/*': ['.png', 1],
          bad: 'nope',
        },
        maxSize: '1024',
        showFileList: 'yes',
        variant: 'floating',
        size: 'xl',
        radius: 'pill',
      }),
    ).toEqual({
      accept: {
        'image/*': ['.png'],
      },
      maxSize: undefined,
      maxFiles: undefined,
      multiple: undefined,
      placeholder: undefined,
      description: undefined,
      showFileList: undefined,
      showStatusSections: undefined,
      variant: undefined,
      size: undefined,
      radius: undefined,
    })
  })
})

describe('rich widget prop parsers', () => {
  it('parses avatar-picker, multi-select, and mention widget props from unknown input', () => {
    expect(
      getAutoFormAvatarPickerWidgetProps({
        items: [
          {
            id: 'ada',
            name: 'Ada Lovelace',
            description: 'ada@example.com',
            avatar: '/ada.png',
            hoverCard: { title: 'Ada Lovelace', radius: 'lg' },
          },
        ],
        placeholder: 'Choose assignee',
        searchable: false,
      }),
    ).toEqual({
      items: [
        {
          id: 'ada',
          name: 'Ada Lovelace',
          description: 'ada@example.com',
          avatar: '/ada.png',
          hoverCard: { title: 'Ada Lovelace', radius: 'lg' },
          disabled: undefined,
        },
      ],
      placeholder: 'Choose assignee',
      searchPlaceholder: undefined,
      searchable: false,
      noResultsText: undefined,
      maxHeight: undefined,
    })

    expect(
      getAutoFormMultiSelectWidgetProps({
        options: [
          { value: 'docs', label: 'Documentation' },
          { value: 'urgent', label: 'Urgent', disabled: true },
        ],
        maxVisibleBadges: 2,
        searchable: false,
        creatable: true,
      }),
    ).toEqual({
      options: [
        { value: 'docs', label: 'Documentation', disabled: undefined },
        { value: 'urgent', label: 'Urgent', disabled: true },
      ],
      placeholder: undefined,
      searchable: false,
      searchPlaceholder: undefined,
      maxSelected: undefined,
      maxSelectedText: undefined,
      showBadges: undefined,
      maxVisibleBadges: 2,
      creatable: true,
    })

    expect(
      getAutoFormTreeLeafSelectWidgetProps({
        options: [
          { value: 'composites/local', label: 'Local', description: 'Owned by this app.' },
          { value: 'composites/forms', label: 'Forms', disabled: true },
        ],
        pathSeparator: '/',
        expandAll: true,
        showSelectedPath: true,
        showDescription: false,
      }),
    ).toEqual({
      options: [
        {
          value: 'composites/local',
          label: 'Local',
          description: 'Owned by this app.',
          disabled: undefined,
        },
        {
          value: 'composites/forms',
          label: 'Forms',
          description: undefined,
          disabled: true,
        },
      ],
      pathSeparator: '/',
      expandAll: true,
      showSelectedPath: true,
      showDescription: false,
    })

    expect(
      getAutoFormMentionTextareaWidgetProps({
        trigger: '@',
        toolbar: true,
        triggers: [
          {
            trigger: '@',
            picker: 'avatar',
            avatarItems: [{ id: 'ada', name: 'Ada Lovelace' }],
          },
          {
            trigger: '#',
            picker: 'multi-select',
            options: [{ value: 'docs', label: 'Documentation' }],
            placeholder: 'Select tags',
          },
        ],
      }),
    ).toEqual({
      mentions: undefined,
      trigger: '@',
      triggers: [
        {
          trigger: '@',
          picker: 'avatar',
          items: undefined,
          avatarItems: [
            {
              id: 'ada',
              name: 'Ada Lovelace',
              description: undefined,
              avatar: undefined,
              hoverCard: undefined,
              disabled: undefined,
            },
          ],
          options: undefined,
          searchable: undefined,
          searchPlaceholder: undefined,
          placeholder: undefined,
          noResultsText: undefined,
          maxSelected: undefined,
          maxSelectedText: undefined,
          showBadges: undefined,
          maxVisibleBadges: undefined,
        },
        {
          trigger: '#',
          picker: 'multi-select',
          items: undefined,
          avatarItems: undefined,
          options: [{ value: 'docs', label: 'Documentation', disabled: undefined }],
          searchable: undefined,
          searchPlaceholder: undefined,
          placeholder: 'Select tags',
          noResultsText: undefined,
          maxSelected: undefined,
          maxSelectedText: undefined,
          showBadges: undefined,
          maxVisibleBadges: undefined,
        },
      ],
      maxItems: undefined,
      noMatchesText: undefined,
      toolbar: true,
      autoSize: undefined,
      rows: undefined,
      minRows: undefined,
      maxRows: undefined,
    })
  })

  it('parses country-picker and date widget props from unknown input', () => {
    expect(
      getAutoFormCountryPickerWidgetProps({
        defaultCountry: 'US',
        countryPlaceholder: 'Choose country',
        statePlaceholder: 'Choose state',
        showStateSelector: true,
        size: 'sm',
        radius: 'lg',
        color: 'primary',
        variant: 'soft',
      }),
    ).toEqual({
      label: undefined,
      size: 'sm',
      variant: 'soft',
      color: 'primary',
      radius: 'lg',
      defaultCountry: 'US',
      countryPlaceholder: 'Choose country',
      statePlaceholder: 'Choose state',
      showStateSelector: true,
    })

    expect(
      getAutoFormDatePickerWidgetProps({
        placeholder: 'Pick a due date',
        enableNaturalLanguage: true,
        dateFormat: 'yyyy-MM-dd',
        size: 'sm',
        radius: 'lg',
      }),
    ).toEqual({
      placeholder: 'Pick a due date',
      enableNaturalLanguage: true,
      dateFormat: 'yyyy-MM-dd',
      size: 'sm',
      variant: undefined,
      color: undefined,
      radius: 'lg',
    })

    expect(
      getAutoFormDateTimePickerWidgetProps({
        size: 'sm',
        color: 'primary',
        showSeconds: true,
        minuteStep: 15,
      }),
    ).toEqual({
      size: 'sm',
      variant: undefined,
      color: 'primary',
      radius: undefined,
      showSeconds: true,
      minuteStep: 15,
    })

    expect(
      getAutoFormTimePickerWidgetProps({
        placeholder: 'Pick a time',
        size: 'sm',
        color: 'primary',
        radius: 'lg',
        showSeconds: true,
        use12HourFormat: true,
        minuteStep: 15,
      }),
    ).toEqual({
      placeholder: 'Pick a time',
      size: 'sm',
      color: 'primary',
      radius: 'lg',
      showSeconds: true,
      use12HourFormat: true,
      minuteStep: 15,
    })

    expect(
      getAutoFormComboboxWidgetProps({
        options: [
          { value: 'ada', label: 'Ada Lovelace' },
          { value: 'grace', label: 'Grace Hopper', disabled: true },
        ],
        placeholder: 'Choose assignee',
        searchPlaceholder: 'Search people',
        noResultsText: 'No people found',
        creatable: true,
        size: 'sm',
        variant: 'soft',
        color: 'primary',
        radius: 'lg',
      }),
    ).toEqual({
      options: [
        { value: 'ada', label: 'Ada Lovelace', disabled: undefined },
        { value: 'grace', label: 'Grace Hopper', disabled: true },
      ],
      placeholder: 'Choose assignee',
      searchPlaceholder: 'Search people',
      noResultsText: 'No people found',
      creatable: true,
      size: 'sm',
      variant: 'soft',
      color: 'primary',
      radius: 'lg',
    })
  })
})
