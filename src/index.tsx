import React from 'react';
import {LogBox, useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Router} from './components/Router';
import {AuthProvider} from './contexts/Auth';
import {IoCProvider} from './contexts/IoCContext';
import {SnackProvider} from './contexts/Snack';
import {ThemeProvider} from './contexts/ThemeProvider';

LogBox.ignoreLogs(['Setting a timer']);

const AppContainer: React.FC = () => {
  const color = useColorScheme();

  return (
    <IoCProvider>
      <ThemeProvider theme={{palette: {type: color ? color : 'light'}}}>
        <SnackProvider>
          <AuthProvider>
            <GestureHandlerRootView style={{flex: 1}}>
              <Router />
            </GestureHandlerRootView>
          </AuthProvider>
        </SnackProvider>
      </ThemeProvider>
    </IoCProvider>
  );
};

export {AppContainer};
