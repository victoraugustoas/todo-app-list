import React from 'react';
import {StyleSheet} from 'react-native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import {IconProps as VectorIconProps} from 'react-native-vector-icons/Icon';

const styles = StyleSheet.create({});

export interface IconProps extends VectorIconProps {
  type: 'feather';
}

const Icon: React.FC<IconProps> = ({type, ...props}) => {
  return type === 'feather' ? <FeatherIcons {...props} /> : <></>;
};

export {Icon};
