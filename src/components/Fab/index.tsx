import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useTheme} from '../../contexts/ThemeProvider';

const styles = StyleSheet.create({});

export interface FabProps extends TouchableOpacityProps {
  variant: 'outlined';
}

const Fab: React.FC<FabProps> = ({variant, children, ...props}) => {
  const theme = useTheme();

  return variant === 'outlined' ? (
    <TouchableOpacity
      {...props}
      style={[
        {
          height: widthPercentageToDP(12),
          width: widthPercentageToDP(12),
          borderRadius: widthPercentageToDP(12) / 2,
          borderColor: theme.palette.primary.light,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        props.style,
      ]}>
      {children}
    </TouchableOpacity>
  ) : (
    <></>
  );
};

export {Fab};
