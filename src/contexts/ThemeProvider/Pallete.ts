export type ColorSelection = 'primary' | 'secondary' | 'brightness';

export type PaletteType = 'dark' | 'light';

export interface Color {
  computed: string;
  light: string;
  dark: string;
  other: string[];
}

export interface BackgroundColor {
  drawer: Color;
  default: Color;
}

export interface Palette {
  primary: Color;
  secondary: Color;
  brightness: Color;
  other: string[];
  hexToRGBA: (hex: string, alpha: number | string) => string;
  type: PaletteType;
  background: BackgroundColor;
}

export type PaletteOptions = Partial<Palette>;
export type ColorOptions = Partial<Color>;

function hexToRGBA(hex: string, alpha: number | string) {
  if (hex.length !== 7) {
    throw new Error('A cor deve possuir pelo menos 7 caracaters. Ex: #XXXXXX');
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
}

const computeColor = (paletteType: PaletteType, color: Color): Color => ({
  ...color,
  computed: paletteType === 'light' ? color.light : color.dark,
});

export const createPalette = (paletteOptions?: PaletteOptions): Palette => {
  return {
    primary: {
      light: '#0F1F55',
      dark: '#0F1F55',
      computed: '#0F1F55',
      other: [],
      ...paletteOptions?.primary,
    },
    secondary: {
      light: '',
      dark: '',
      computed: '',
      other: [],
      ...paletteOptions?.secondary,
    },
    brightness: {
      light: '',
      dark: '',
      computed: '',
      other: [],
      ...paletteOptions?.brightness,
    },
    background: {
      drawer: {
        light: '#0F1F55',
        dark: '#0F1F55',
        computed: '#0F1F55',
        other: [],
        ...paletteOptions?.background?.drawer,
      },
      default: computeColor(
        paletteOptions?.type === 'dark' ? 'dark' : 'light',
        {
          light: '#F4F6FD',
          dark: '#3451A1',
          computed: '#F4F6FD',
          other: [],
          ...paletteOptions?.background?.default,
        },
      ),
    },
    other: [],
    type: 'light',
    hexToRGBA,
    ...paletteOptions,
  };
};
