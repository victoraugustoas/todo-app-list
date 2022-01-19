import React from 'react';
import {SafeAreaView} from 'react-native';
import {CardTask} from './components/CardTask';
import {Header} from './components/Header';

const AppContainer: React.FC = () => {
  return (
    <SafeAreaView>
      <Header />
      <CardTask />
    </SafeAreaView>
  );
};

export {AppContainer};
