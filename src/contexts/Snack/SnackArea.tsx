import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useTheme} from '../ThemeProvider';
import {Theme} from '../ThemeProvider/Theme';
import {SnackPosition} from './Snack';

const useStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: widthPercentageToDP(10),
      position: 'absolute',
      zIndex: theme.zIndex.snackBarArea,
      maxHeight: heightPercentageToDP(30),
      width: '100%',
    },
    containerBottom: {
      bottom: 0,
      left: 0,
      marginBottom: heightPercentageToDP(2),
    },
    containerTop: {
      top: 0,
      left: 0,
      marginTop: heightPercentageToDP(4),
    },
  });

const SnackArea: React.FC<{position: SnackPosition}> = ({
  position,
  children,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View
      style={[
        styles.container,
        position === 'bottom' ? styles.containerBottom : styles.containerTop,
      ]}>
      {children}
    </View>
  );
};

export {SnackArea};
