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

const styles = StyleSheet.create({});

const Layout: React.FC = ({children}) => {
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
    <Animated.View
      style={[{backgroundColor: '#F4F6FD', flex: 1}, animatedStyles]}>
      {children}
    </Animated.View>
  );
};

export {Layout};
