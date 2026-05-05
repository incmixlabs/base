import type { FormDefinition } from "@incmix/core";

export interface FormSummaryProps {
  form: FormDefinition;
}

export function FormSummary({ form }: FormSummaryProps) {
  return (
    <section aria-label={form.title}>
      <h2>{form.title}</h2>
      <ul>
        {form.fields.map((field) => (
          <li key={field.id}>{field.label}</li>
        ))}
      </ul>
    </section>
  );
}
