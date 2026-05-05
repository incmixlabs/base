export type FieldKind = "text" | "number" | "boolean" | "date" | "select";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldDefinition {
  id: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  options?: FieldOption[];
}

export interface FormDefinition {
  id: string;
  title: string;
  fields: FieldDefinition[];
}

export function defineForm(definition: FormDefinition): FormDefinition {
  return definition;
}
