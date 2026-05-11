export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const radius = {
  tile: 12,
  card: 16,
  button: 12,
  fab: 28,
  pill: 999,
} as const;

export const typography = {
  caption: 12,
  body: 14,
  bodyLg: 16,
  title: 20,
  display: 28,
  hero: 36,
} as const;

export const motion = {
  spring: { type: 'spring' as const, damping: 18, mass: 0.8, stiffness: 220 },
  press: { type: 'spring' as const, damping: 20, mass: 0.7, stiffness: 360 },
  fadeIn: { duration: 0.22 },
} as const;

export const palette = {
  light: {
    bg: '#FAFAFA',
    surface: '#FFFFFF',
    border: '#ECECEC',
    text: '#0B0B0C',
    muted: '#6B6B70',
    accent: '#0EA5E9',
  },
  dark: {
    bg: '#0B0B0C',
    surface: '#161618',
    border: '#26262A',
    text: '#F5F5F7',
    muted: '#9A9AA0',
    accent: '#38BDF8',
  },
} as const;

export type Palette = typeof palette.light;
