import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Router} from './components/Router';

const AppContainer: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Router />
    </GestureHandlerRootView>
  );
};

export {AppContainer};
