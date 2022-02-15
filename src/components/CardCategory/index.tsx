import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '../../contexts/ThemeProvider';
import { Theme } from '../../contexts/ThemeProvider/Theme';
import { boxShadow } from '../../utils/boxShadow';
import { Typography } from '../Typography';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      ...boxShadow(1),
      borderRadius: theme.shape.borderRadius,
      backgroundColor:
        theme.palette.type === 'light'
          ? '#fff'
          : theme.palette.background.drawer.computed,
      padding: widthPercentageToDP(4),
      minWidth: widthPercentageToDP(55),
    },
    title: {
      fontSize: widthPercentageToDP(8),
      color: theme.palette.type === 'light' ? '#000' : '#fff',
    },
    numberTasks: {
      fontSize: widthPercentageToDP(5.4),
      color: theme.palette.primary.computed,
    },
    progressBarContainer: {
      width: '100%',
      height: widthPercentageToDP(0.8),
      alignItems: 'flex-start',
      justifyContent: 'center',
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
    },
    progressBg: {
      backgroundColor: theme.palette.background.default.computed,
      width: '100%',
      height: '100%',
      borderRadius: theme.shape.borderRadius,
    },
    progress: {
      height: '100%',
      position: 'absolute',
      borderRadius: theme.shape.borderRadius,
    },
    indicator: {
      position: 'absolute',
      height: widthPercentageToDP(0.9),
      top: -widthPercentageToDP(0.9),
      width: widthPercentageToDP(1),
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
    },
  });

export interface CardCategoryProps extends TouchableWithoutFeedbackProps {
  title: string;
  colorCategory: string;
  numberOfTasks: number;
  totalTasksConcluded: number;
  selected?: boolean;
}

const CardCategory: React.FC<CardCategoryProps> = ({
  numberOfTasks,
  title,
  totalTasksConcluded,
  colorCategory,
  selected,
  ...props
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const progressValue = useDerivedValue(() =>
    numberOfTasks > 0
      ? `${(totalTasksConcluded / numberOfTasks) * 100}%`
      : '0%',
  );
  const progressStyle = useAnimatedStyle(() => ({
    width: withTiming(progressValue.value),
  }));

  const indicatorValue = useDerivedValue(() =>
    numberOfTasks > 0
      ? `${(1 - totalTasksConcluded / numberOfTasks) * 100}%`
      : '0%',
  );
  const indicatorStyle = useAnimatedStyle(() => ({
    right: withTiming(indicatorValue.value),
    opacity:
      indicatorValue.value === '0%' || indicatorValue.value === '100%' ? 0 : 1,
  }));

  const animateColor = useDerivedValue(() =>
    withTiming(selected ? 1 : 0, { duration: 450 }),
  );

  const lightenColor =
    theme.palette.type === 'light'
      ? theme.palette.lighten(theme.palette.primary.light, 0.5)
      : theme.palette.lighten(theme.palette.background.drawer.computed, 0.8);

  const interpolateColorSelected = useDerivedValue(() => {
    return interpolateColor(
      animateColor.value,
      [0, 1],
      [
        theme.palette.type === 'light'
          ? '#fff'
          : theme.palette.background.drawer.computed,
        lightenColor,
      ],
    );
  });
  const cardStyle = useAnimatedStyle(() => {
    return { backgroundColor: interpolateColorSelected.value };
  });

  return (
    <TouchableWithoutFeedback {...props}>
      <Animated.View style={[styles.container, cardStyle]}>
        <Typography style={styles.numberTasks}>
          {numberOfTasks === 1 ? '1 tarefa' : `${numberOfTasks} tarefas`}
        </Typography>
        <Typography style={styles.title}>{title}</Typography>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBg} />
          <Animated.View
            style={[
              styles.indicator,
              indicatorStyle,
              { backgroundColor: colorCategory },
            ]}
          />
          <Animated.View
            style={[
              styles.progress,
              progressStyle,
              { backgroundColor: colorCategory },
            ]}
          />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export { CardCategory };
