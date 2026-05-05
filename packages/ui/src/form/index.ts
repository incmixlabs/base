'use client'

import '../theme/typography-tokens.css'

// Form Input Components

export {
  AutoFormMentionTextarea,
  type AutoFormMentionTextareaConfig,
  type AutoFormMentionTextareaProps,
} from './AutoFormMentionTextarea'
export { type AvatarItem, AvatarPicker, type AvatarPickerProps } from './AvatarPicker'
export {
  Checkbox,
  type CheckboxProps,
  type CheckboxSize,
  CheckboxWithLabel,
  type CheckboxWithLabelProps,
} from './Checkbox'
export {
  type CheckboxCardSize,
  CheckboxCards,
  type CheckboxCardsItemProps,
  type CheckboxCardsProps,
} from './CheckboxCards'
export {
  CheckboxGroup,
  type CheckboxGroupItemProps,
  type CheckboxGroupProps,
  type CheckboxGroupRootProps,
} from './CheckboxGroup'
export {
  CheckboxGroupWrapper,
  type CheckboxGroupWrapperItem,
  type CheckboxGroupWrapperProps,
  type CheckboxGroupWrapperRenderItem,
} from './CheckboxGroupWrapper'
export { Combobox, type ComboboxOption, type ComboboxProps } from './Combobox'
export {
  type CardType,
  CreditCardInput,
  type CreditCardInputProps,
  type CreditCardValue,
} from './CreditCardInput'
// Date & Time Components
// Form Layout Components
export { FieldGroup, type FieldGroupProps, type FieldGroupRowProps, type FieldGroupSectionProps } from './FieldGroup'
export {
  type FieldGroupContextValue,
  FieldGroupProvider,
  type FieldGroupResolvedValue,
  useFieldGroup,
  useFieldGroupOptional,
} from './FieldGroupContext'
export { Fieldset, type FieldsetProps } from './Fieldset'
export {
  FloatingToolbar,
  type FloatingToolbarAction,
  FloatingToolbarButton,
  type FloatingToolbarProps,
  type FloatingToolbarRect,
  FloatingToolbarSeparator,
} from './FloatingToolbar'
export {
  InputMask,
  type InputMaskProps,
  type MaskPreset,
  maskPresets,
} from './InputMask'
export {
  InputOTP,
  InputOTPPrimitive,
  type InputOTPProps,
  type InputOTPVariant,
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
} from './InputOTP'
export { Label, type LabelProps } from './Label'
export {
  type MentionItem,
  MentionTextarea,
  type MentionTextareaProps,
  type PickerRenderProps,
  type TriggerConfig,
} from './MentionTextarea'
export {
  MultiSelect,
  type MultiSelectOption,
  type MultiSelectProps,
} from './MultiSelect'
export {
  AvatarMentionPicker,
  type AvatarMentionPickerProps,
  MultiSelectMentionPicker,
  type MultiSelectMentionPickerProps,
} from './mention-pickers'
export {
  NumberInput,
  type NumberInputIconButtonProps,
  type NumberInputProps,
  type NumberInputVariant,
} from './NumberInput'
export {
  PasswordInput,
  type PasswordInputProps,
} from './PasswordInput'
export {
  type RadioCardSize,
  RadioCards,
  type RadioCardsItemProps,
  type RadioCardsRootProps,
} from './RadioCards'
export {
  RadioGroup,
  type RadioGroupItemProps,
  type RadioGroupRootProps,
  type RadioSize,
} from './RadioGroup'
export {
  RadioGroupWrapper,
  type RadioGroupWrapperItem,
  type RadioGroupWrapperProps,
  type RadioGroupWrapperRenderItem,
} from './RadioGroupWrapper'
export { Rating, RatingItem, type RatingItemProps, type RatingProps, useRating } from './Rating'
export { SearchInput, type SearchInputProps } from './SearchInput'
export { Select, SelectItem, type SelectProps } from './Select'
export {
  defaultToolbarActions,
  type FormatContext,
  type FormatResult,
  SelectionToolbar,
  type SelectionToolbarProps,
  type ToolbarAction,
} from './SelectionToolbar'
export {
  SignatureInput,
  type SignatureInputProps,
} from './SignatureInput'
export { Slider, type SliderProps, type SliderSize } from './Slider'
export { Switch, type SwitchProps, type SwitchSize, SwitchWithLabel, type SwitchWithLabelProps } from './Switch'
export { SwitchGroup, type SwitchGroupProps, type SwitchGroupSize } from './SwitchGroup'
export {
  SwitchGroupWrapper,
  type SwitchGroupWrapperItem,
  type SwitchGroupWrapperProps,
  type SwitchGroupWrapperRenderItem,
} from './SwitchGroupWrapper'
export { Textarea, type TextareaProps } from './Textarea'
export { TextField, type TextFieldProps } from './TextField'
// Shared Styles (for building custom form components)
export {
  colorStyles,
  containerColorStyles,
  containerVariantStyles,
  getBaseVariant,
  highlightColorStyles,
  solidColorStyles,
  variantStyles,
} from './textFieldStyles'
export {
  type TextareaSelection,
  type UseTextareaSelectionReturn,
  useTextareaSelection,
} from './useTextareaSelection'
export { withFieldGroup } from './withFieldGroup'
