import {ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from '../../contexts/ThemeProvider';

const styles = StyleSheet.create({});

const LoadingDimiss: React.FC = () => {
  const theme = useTheme();

  return <ActivityIndicator color={theme.palette.secondary.computed} />;
};

export {LoadingDimiss};
