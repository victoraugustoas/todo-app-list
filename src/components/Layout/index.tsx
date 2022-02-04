import {useDrawerStatus} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '../../contexts/ThemeProvider';
import {Theme} from '../../contexts/ThemeProvider/Theme';
import {Header} from '../Header';
import {NavigationProps} from '../Router';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    layoutContainer: {
      backgroundColor: theme.palette.background.default.computed,
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
    },
    buttonAdd: {
      position: 'absolute',
      right: widthPercentageToDP(7),
      bottom: widthPercentageToDP(7),

      height: widthPercentageToDP(14),
      width: widthPercentageToDP(14),

      backgroundColor: '#006DFF',
      borderRadius: widthPercentageToDP(14) / 2,

      justifyContent: 'center',
      alignItems: 'center',

      elevation: 6,
      shadowColor: '#006DFF',

      zIndex: 15,
    },
    icon: {color: '#fff', fontSize: widthPercentageToDP(6)},
  });

export interface LayoutProps {
  showAddButton?: boolean;
}

const Layout: React.FC<LayoutProps> = ({showAddButton, children}) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const drawerStatus = useDrawerStatus();
  const borderRadius = widthPercentageToDP(12);
  const router = useNavigation<NavigationProps>();

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
      <Header />
      {showAddButton ? (
        <TouchableWithoutFeedback
          onPress={() => {
            router.navigate('AddTask');
          }}>
          <View style={styles.buttonAdd}>
            <Icon name="plus" style={styles.icon} />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <></>
      )}
      {children}
    </Animated.View>
  );
};

export {Layout};
