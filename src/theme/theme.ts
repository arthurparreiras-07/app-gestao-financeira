/**
 * Tema profissional moderno
 * Paleta de cores otimizada para aplicação financeira
 */

// Cores base que não mudam
const baseColors = {
  // Cores primárias - Verde moderno e vibrante
  primary: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#10B981", // Principal - Tom mais vibrante
    600: "#059669",
    700: "#047857",
    800: "#065F46",
    900: "#064E3B",
  },

  // Cores secundárias - Azul moderno
  secondary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6", // Principal
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
  },

  // Estados - Cores mais modernas
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // Categorias (tons vibrantes e modernos)
  categories: {
    food: "#EF4444", // Vermelho vibrante
    transport: "#06B6D4", // Cyan
    entertainment: "#8B5CF6", // Roxo
    shopping: "#EC4899", // Pink
    health: "#F59E0B", // Âmbar
    education: "#6366F1", // Indigo
    others: "#84CC16", // Lima
  },
};

// Tema claro - Mais limpo e moderno
const lightTheme = {
  ...baseColors,
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
  background: "#FFFFFF",
  backgroundSecondary: "#F9FAFB",
  border: "#E5E7EB",
  text: {
    primary: "#111827",
    secondary: "#4B5563",
    tertiary: "#6B7280",
    inverse: "#FFFFFF",
  },
};

// Tema escuro - Mais suave e moderno
const darkTheme = {
  ...baseColors,
  gray: {
    50: "#030712",
    100: "#111827",
    200: "#1F2937",
    300: "#374151",
    400: "#4B5563",
    500: "#6B7280",
    600: "#9CA3AF",
    700: "#D1D5DB",
    800: "#E5E7EB",
    900: "#F9FAFB",
  },
  background: "#0F1419",
  backgroundSecondary: "#1A1F2E",
  border: "#2D3748",
  text: {
    primary: "#F9FAFB",
    secondary: "#9CA3AF",
    tertiary: "#6B7280",
    inverse: "#111827",
  },
};

export const getColors = (isDark: boolean) => (isDark ? darkTheme : lightTheme);

// Para compatibilidade com código existente
export const colors = lightTheme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const borderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 19,
  xxl: 24,
  xxxl: 32,
};

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
};

export type Theme = typeof theme;
