import React, {useState} from 'react';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {CardTask} from './components/CardTask';
import {Header} from './components/Header';
import {Typography} from './components/Typography';

const AppContainer: React.FC = () => {
  const [tasks, setTasks] = useState([
    {id: 1, title: 'Tarefa 01 do dia D'},
    {id: 2, title: 'Create the app'},
    {id: 3, title: 'daily meeting with team'},
    {id: 4, title: 'daily meeting with team'},
  ]);

  const [selectedTask, setSelectedTasks] = useState<number[]>([]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: '#F4F6FD', flex: 1}}>
        <Header />
        <View style={{marginHorizontal: widthPercentageToDP(3)}}>
          {tasks.map((task, idx) => {
            return (
              <CardTask
                style={{marginVertical: widthPercentageToDP(1.2)}}
                key={task.id}
                title={task.title}
                selected={selectedTask.some(selected => selected === idx)}
                onPress={() =>
                  setSelectedTasks(oldState => {
                    const oldStateCopy = [...oldState];
                    const selectedIdx = oldStateCopy.findIndex(
                      selected => selected === idx,
                    );
                    if (selectedIdx > -1) {
                      oldStateCopy.splice(selectedIdx, 1);
                    } else {
                      oldStateCopy.push(idx);
                    }

                    return oldStateCopy;
                  })
                }
                onDimiss={() => {
                  setTasks(oldState => {
                    const copyOldState = [...oldState];
                    copyOldState.splice(idx, 1);
                    return copyOldState;
                  });
                }}
              />
            );
          })}
        </View>
        <TouchableOpacity
          onPress={() => {
            setTasks(old => [
              ...old,
              {id: 33, title: 'daily meeting with team'},
            ]);
          }}>
          <Typography>Add</Typography>
        </TouchableOpacity>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export {AppContainer};
