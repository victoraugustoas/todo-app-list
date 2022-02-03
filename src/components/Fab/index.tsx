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
  size?: number;
}

const Fab: React.FC<FabProps> = ({variant, size, children, ...props}) => {
  const theme = useTheme();

  return variant === 'outlined' ? (
    <TouchableOpacity
      {...props}
      style={[
        {
          height: size ? size : widthPercentageToDP(12),
          width: size ? size : widthPercentageToDP(12),
          borderRadius: size ? size / 2 : widthPercentageToDP(12) / 2,
          borderColor: theme.palette.lighten(theme.palette.primary.light, 0.3),
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
