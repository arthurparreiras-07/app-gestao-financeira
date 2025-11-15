/**
 * Tema profissional inspirado no GitHub
 * Paleta de cores para aplicação financeira
 */

// Cores base que não mudam
const baseColors = {
  // Cores primárias - Verde financeiro
  primary: {
    50: "#E6F7F0",
    100: "#B3E8D4",
    200: "#80D9B8",
    300: "#4DCA9C",
    400: "#2BB87F",
    500: "#1FA672", // Principal
    600: "#198F63",
    700: "#137854",
    800: "#0D6145",
    900: "#074A36",
  },

  // Cores secundárias - Azul profissional
  secondary: {
    50: "#E8F4F8",
    100: "#C2E0ED",
    200: "#9CCCE2",
    300: "#76B8D7",
    400: "#50A4CC",
    500: "#3B8FB3", // Principal
    600: "#2F7A9E",
    700: "#246589",
    800: "#185074",
    900: "#0D3B5F",
  },

  // Estados
  success: "#28A745",
  warning: "#FFA500",
  error: "#DC3545",
  info: "#17A2B8",

  // Categorias (tons profissionais)
  categories: {
    food: "#FF6B6B",
    transport: "#4ECDC4",
    entertainment: "#FFE66D",
    shopping: "#95E1D3",
    health: "#F38181",
    education: "#AA96DA",
    others: "#FCBAD3",
  },
};

// Tema claro
const lightTheme = {
  ...baseColors,
  gray: {
    50: "#FAFBFC",
    100: "#F6F8FA",
    200: "#E1E4E8",
    300: "#D1D5DA",
    400: "#959DA5",
    500: "#6A737D",
    600: "#586069",
    700: "#444D56",
    800: "#2F363D",
    900: "#24292E",
  },
  background: "#FFFFFF",
  backgroundSecondary: "#F6F8FA",
  border: "#E1E4E8",
  text: {
    primary: "#24292E",
    secondary: "#586069",
    tertiary: "#6A737D",
    inverse: "#FFFFFF",
  },
};

// Tema escuro
const darkTheme = {
  ...baseColors,
  gray: {
    50: "#0D1117",
    100: "#161B22",
    200: "#21262D",
    300: "#30363D",
    400: "#484F58",
    500: "#6E7681",
    600: "#8B949E",
    700: "#B1BAC4",
    800: "#C9D1D9",
    900: "#F0F6FC",
  },
  background: "#0D1117",
  backgroundSecondary: "#161B22",
  border: "#30363D",
  text: {
    primary: "#F0F6FC",
    secondary: "#8B949E",
    tertiary: "#6E7681",
    inverse: "#0D1117",
  },
};

export const getColors = (isDark: boolean) => (isDark ? darkTheme : lightTheme);

// Para compatibilidade com código existente
export const colors = lightTheme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
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
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
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
