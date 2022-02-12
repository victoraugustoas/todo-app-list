import React from 'react';
import {
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useTheme} from '../../contexts/ThemeProvider';
import {Theme} from '../../contexts/ThemeProvider/Theme';
import {boxShadow} from '../../utils/boxShadow';
import {Typography} from '../Typography';

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
    title: {fontSize: widthPercentageToDP(8)},
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

export interface CardCategoryProps extends TouchableOpacityProps {
  title: string;
  colorCategory: string;
  numberOfTasks: number;
  totalTasksConcluded: number;
}

const CardCategory: React.FC<CardCategoryProps> = ({
  numberOfTasks,
  title,
  totalTasksConcluded,
  colorCategory,
  ...props
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <TouchableOpacity {...props} style={[styles.container, props.style]}>
      <Typography style={styles.numberTasks}>
        {numberOfTasks === 1 ? '1 tarefa' : `${numberOfTasks} tarefas`}
      </Typography>
      <Typography style={styles.title}>{title}</Typography>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBg} />
        <View
          style={[
            styles.indicator,
            {
              right: `${(1 - totalTasksConcluded / numberOfTasks) * 100}%`,
              backgroundColor: colorCategory,
            },
          ]}
        />
        <View
          style={[
            styles.progress,
            {
              width: `${(totalTasksConcluded / numberOfTasks) * 100}%`,
              backgroundColor: colorCategory,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

export {CardCategory};
