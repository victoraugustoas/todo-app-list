import React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';

const styles = StyleSheet.create({
  textRegular: {fontFamily: 'Dongle-Regular'},
  textBold: {fontFamily: 'Dongle-Bold'},
  textLight: {fontFamily: 'Dongle-Light'},
});

export type FontWeight = 'regular' | 'light' | 'bold';

export interface TypographyProps extends TextProps {
  fontWeight?: FontWeight;
}

export const getFontWeight = (weight: FontWeight) => {
  return [
    weight === 'bold' && styles.textBold,
    weight === 'light' && styles.textLight,
    weight === 'regular' && styles.textRegular,
  ];
};

const Typography: React.FC<TypographyProps> = ({
  children,
  fontWeight = 'regular',
  ...props
}) => {
  return (
    <Text {...props} style={[props.style, getFontWeight(fontWeight)]}>
      {children}
    </Text>
  );
};

export {Typography};
