import {useDrawerStatus} from '@react-navigation/drawer';
import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useTheme} from '../../contexts/ThemeProvider';
import {Theme} from '../../contexts/ThemeProvider/Theme';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    layoutContainer: {
      backgroundColor: theme.palette.background.default.computed,
      flex: 1,
    },
  });

const Layout: React.FC = ({children}) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const drawerStatus = useDrawerStatus();
  const borderRadius = widthPercentageToDP(12);

  const drawerProgress = useDerivedValue(() => {
    if (drawerStatus === 'open') {
      return withTiming(1);
    } else {
      return withTiming(0);
    }
  });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{scale: interpolate(drawerProgress.value, [0, 1], [1, 0.8])}],
    borderRadius: interpolate(drawerProgress.value, [0, 1], [0, borderRadius]),
  }));

  return (
    <Animated.View style={[styles.layoutContainer, animatedStyles]}>
      {children}
    </Animated.View>
  );
};

export {Layout};
