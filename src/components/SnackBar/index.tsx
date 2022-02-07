import React from 'react';
import {StyleSheet, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {SnackType} from '../../contexts/Snack/Snack';
import {useTheme} from '../../contexts/ThemeProvider';
import {Theme} from '../../contexts/ThemeProvider/Theme';
import {Icon} from '../Icon';
import {Typography} from '../Typography';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.shape.borderRadius * 0.5,
    },
    errorBg: {backgroundColor: theme.palette.error.computed},
    icon: {color: '#fff', fontSize: widthPercentageToDP(5.4), flex: 1},
    text: {color: '#fff', fontSize: widthPercentageToDP(7), flex: 1},
  });

export interface SnackBarProps {
  title: string;
  type: SnackType;
}

const SnackBar: React.FC<SnackBarProps> = ({title, type}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return type === 'error' ? (
    <View style={[styles.container, styles.errorBg]}>
      <Icon name="x-octagon" type="feather" style={styles.icon} />
      <Typography style={styles.text}>{title}</Typography>
    </View>
  ) : (
    <></>
  );
};

export {SnackBar};
