# Form Input Primitives

Composite text-like inputs should use `TextField` for their editable text surface so size, variant, radius, color, disabled, error, and accessible label behavior stay aligned with the core input component.

`PhoneInput` keeps its country selector as interactive left chrome, but the phone number editor is a `TextField`.
`CreditCardInput` renders card number, expiry, CVV, and cardholder name as `TextField` controls.

Some native inputs should remain raw because they are not visual text-field surfaces:

- Dropdown and picker search inputs, where the input is part of command/listbox focus management.
- Date hidden inputs, which exist only for form submission values and must stay invisible.
- File upload inputs, which must remain native file controls for browser file-picker behavior.
