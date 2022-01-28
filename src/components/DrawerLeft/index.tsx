import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Typography} from '../Typography';

const styles = StyleSheet.create({});

const DrawerLeft: React.FC<DrawerContentComponentProps> = props => {
  return (
    <DrawerContentScrollView style={{backgroundColor: '#2643C4'}}>
      <View></View>
    </DrawerContentScrollView>
  );
};

export {DrawerLeft};
