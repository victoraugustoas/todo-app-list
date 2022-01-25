import {useFonts} from 'expo-font';
import React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';

const styles = StyleSheet.create({
  textRegular: {fontFamily: 'DongleRegular'},
  textBold: {fontFamily: 'DongleBold'},
  textLight: {fontFamily: 'DongleLight'},
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
  const [fontsLoaded] = useFonts({
    DongleRegular: require('../../assets/fonts/Dongle/Dongle-Regular.ttf'),
    DongleBold: require('../../assets/fonts/Dongle/Dongle-Bold.ttf'),
    DongleLight: require('../../assets/fonts/Dongle/Dongle-Light.ttf'),
  });

  return !fontsLoaded ? (
    <></>
  ) : (
    <Text {...props} style={[props.style, getFontWeight(fontWeight)]}>
      {children}
    </Text>
  );
};

export {Typography};
