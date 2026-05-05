import { defineForm } from "@incmix/core";
import { FormSummary } from "@incmix/react";

export { defineForm, FormSummary };
export type { FieldDefinition, FieldKind, FieldOption, FormDefinition } from "@incmix/core";

export interface AutoformSummaryProps {
  fields: string[];
}

export function AutoformSummary({ fields }: AutoformSummaryProps) {
  const form = defineForm({
    id: "example",
    title: "Autoform",
    fields: fields.map((field) => ({
      id: field.toLowerCase().replaceAll(" ", "-"),
      label: field,
      kind: "text",
    })),
  });

  return <FormSummary form={form} />;
}
