export const tokens = {
  color: {
    accent: "#2563eb",
    accentText: "#ffffff",
    border: "#d4d4d8",
    surface: "#ffffff",
    text: "#18181b",
  },
  radius: {
    sm: 6,
    md: 8,
  },
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
  },
} as const;

export type ThemeTokens = typeof tokens;
