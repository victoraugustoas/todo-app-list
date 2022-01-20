import React from 'react';
import {SafeAreaView} from 'react-native';
import {CardTask} from './components/CardTask';
import {Header} from './components/Header';

const AppContainer: React.FC = () => {
  return (
    <SafeAreaView>
      <Header />
      <CardTask title="Tarefa 01 do dia D" />
      <CardTask title="Create the app" />
      <CardTask title="daily meeting with team" selected={true} />
      <CardTask title="daily meeting with team" />
    </SafeAreaView>
  );
};

export {AppContainer};
