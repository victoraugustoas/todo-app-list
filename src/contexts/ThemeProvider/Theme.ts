import {createPalette, Palette, PaletteOptions} from './Pallete';

export interface Theme {
  palette: Palette;
}

export interface ThemeOptions {
  palette?: PaletteOptions;
}

export const createTheme = (themeOptions?: ThemeOptions): Theme => {
  return {palette: createPalette(themeOptions?.palette)};
};
