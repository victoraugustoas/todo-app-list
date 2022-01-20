import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {CardTask} from './components/CardTask';
import {Header} from './components/Header';

const AppContainer: React.FC = () => {
  return (
    <SafeAreaView style={{backgroundColor: '#F4F6FD', flex: 1}}>
      <Header />
      <View style={{marginHorizontal: widthPercentageToDP(3)}}>
        <CardTask
          title="Tarefa 01 do dia D"
          style={{marginVertical: heightPercentageToDP(1)}}
        />
        <CardTask
          title="Create the app"
          style={{marginVertical: heightPercentageToDP(1)}}
        />
        <CardTask
          title="daily meeting with team"
          selected={true}
          style={{marginVertical: heightPercentageToDP(1)}}
        />
        <CardTask
          title="daily meeting with team"
          style={{marginVertical: heightPercentageToDP(1)}}
        />
      </View>
    </SafeAreaView>
  );
};

export {AppContainer};
