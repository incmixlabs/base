import { tokens } from "@incmix/theme";

export interface ButtonProps {
  label: string;
  disabled?: boolean;
}

export function Button({ label, disabled }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        background: tokens.color.accent,
        border: 0,
        borderRadius: tokens.radius.sm,
        color: tokens.color.accentText,
        font: "inherit",
        padding: "0.5rem 0.75rem",
      }}
      type="button"
    >
      {label}
    </button>
  );
}

export type { ColumnDefinition } from "@incmix/table";
export { tokens } from "@incmix/theme";
