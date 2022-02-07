import {widthPercentageToDP} from 'react-native-responsive-screen';

export interface Shape {
  borderRadius: number;
}

export type ShapeOptions = Partial<Shape>;

export const createShape = (shapeOptions?: ShapeOptions): Shape => {
  return {
    borderRadius: widthPercentageToDP(5),
    ...shapeOptions,
  };
};
