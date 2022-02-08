import React from 'react';
import {StyleSheet} from 'react-native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconProps as VectorIconProps} from 'react-native-vector-icons/Icon';

const styles = StyleSheet.create({});

export interface IconProps extends VectorIconProps {
  type: 'feather' | 'material-community';
}

const Icon: React.FC<IconProps> = ({type, ...props}) => {
  return type === 'feather' ? (
    <FeatherIcons {...props} />
  ) : type === 'material-community' ? (
    <MaterialCommunity {...props} />
  ) : (
    <></>
  );
};

export {Icon};
