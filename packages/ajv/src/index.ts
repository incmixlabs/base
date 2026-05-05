import type { FormDefinition } from "@incmix/core";

export interface JsonSchema {
  type: "object";
  required?: string[];
  properties: Record<string, unknown>;
}

export function formToJsonSchema(form: FormDefinition): JsonSchema {
  const required = form.fields.filter((field) => field.required).map((field) => field.id);

  return {
    type: "object",
    required: required.length > 0 ? required : undefined,
    properties: Object.fromEntries(
      form.fields.map((field) => [
        field.id,
        {
          title: field.label,
          type: field.kind === "number" ? "number" : field.kind === "boolean" ? "boolean" : "string",
        },
      ]),
    ),
  };
}
