import React from 'react';
import {useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Router} from './components/Router';
import {ThemeProvider} from './contexts/ThemeProvider';

const AppContainer: React.FC = () => {
  const color = useColorScheme();

  return (
    <ThemeProvider theme={{palette: {type: color ? color : 'light'}}}>
      <GestureHandlerRootView style={{flex: 1}}>
        <Router />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

export {AppContainer};
