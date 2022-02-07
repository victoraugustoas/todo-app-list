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
  error: Color;
  other: string[];
  hexToRGBA: (hex: string, alpha: number | string) => string;
  lighten: (hex: string, value: number) => string;
  darken: (hex: string, value: number) => string;
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
function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(String((R * (100 + percent)) / 100));
  G = parseInt(String((G * (100 + percent)) / 100));
  B = parseInt(String((B * (100 + percent)) / 100));

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  let RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  let GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  let BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
}

const computeColor = (computed: {
  paletteType?: PaletteType;
  color: Color;
}): Color => ({
  ...computed.color,
  computed:
    computed.paletteType === 'light'
      ? computed.color.light
      : computed.color.dark,
});

const lighten = (hex: string, value: number) => shadeColor(hex, value * 100);
const darken = (hex: string, value: number) => shadeColor(hex, -(value * 100));

export const createPalette = (paletteOptions?: PaletteOptions): Palette => {
  return {
    primary: computeColor({
      color: {
        light: '#9D9AB4',
        dark: '#FAFCFE',
        computed: '',
        other: [],
        ...paletteOptions?.primary,
      },
      paletteType: paletteOptions?.type,
    }),
    secondary: computeColor({
      color: {
        light: '#006DFF',
        dark: darken('#006DFF', 0.7),
        computed: '',
        other: [],
        ...paletteOptions?.primary,
      },
      paletteType: paletteOptions?.type,
    }),
    background: {
      drawer: computeColor({
        paletteType: paletteOptions?.type,
        color: {
          light: '#0F1F55',
          dark: '#0F1F55',
          computed: '',
          other: [],
          ...paletteOptions?.background?.drawer,
        },
      }),
      default: computeColor({
        paletteType: paletteOptions?.type,
        color: {
          light: '#F4F6FD',
          dark: '#3451A1',
          computed: '',
          other: [],
          ...paletteOptions?.background?.default,
        },
      }),
    },
    error: computeColor({
      color: {
        computed: '',
        dark: '#A71C1C',
        light: lighten('#A71C1C', 0.8),
        other: [],
        ...paletteOptions?.error,
      },
      paletteType: paletteOptions?.type,
    }),
    other: [],
    type: 'light',
    hexToRGBA,
    lighten,
    darken,
    ...paletteOptions,
  };
};
