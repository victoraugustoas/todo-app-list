import React from 'react';
import {useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Router} from './components/Router';
import {AuthProvider} from './contexts/Auth';
import {IoCProvider} from './contexts/IoCContext';
import {ThemeProvider} from './contexts/ThemeProvider';

const AppContainer: React.FC = () => {
  const color = useColorScheme();

  return (
    <IoCProvider>
      <ThemeProvider theme={{palette: {type: color ? color : 'light'}}}>
        <AuthProvider>
          <GestureHandlerRootView style={{flex: 1}}>
            <Router />
          </GestureHandlerRootView>
        </AuthProvider>
      </ThemeProvider>
    </IoCProvider>
  );
};

export {AppContainer};
