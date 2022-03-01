import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '.';
import { createPalette, Palette, PaletteOptions } from './Pallete';
import { createShape, Shape, ShapeOptions } from './Shape';
import { createZindex, ZIndex, ZIndexOptions } from './Zindex';

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

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
export const makeStyles = <T extends NamedStyles<T>>(
  styles: (theme: Theme) => NamedStyles<T>,
) => {
  return () => {
    const theme = useTheme();
    return styles(theme);
  };
};
