import {createPalette, Palette, PaletteOptions} from './Pallete';
import {createShape, Shape, ShapeOptions} from './Shape';
import {createZindex, ZIndex, ZIndexOptions} from './Zindex';

export interface Theme {
  palette: Palette;
  shape: Shape;
  zIndex: ZIndex;
}

export interface ThemeOptions {
  palette?: PaletteOptions;
  shape?: ShapeOptions;
  zIndex?: ZIndexOptions;
}

export const createTheme = (themeOptions?: ThemeOptions): Theme => {
  return {
    palette: createPalette(themeOptions?.palette),
    shape: createShape(themeOptions?.shape),
    zIndex: createZindex(themeOptions?.zIndex),
  };
};
