import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {CardTask} from '../../components/CardTask';
import {Header} from '../../components/Header';
import {Layout} from '../../components/Layout';
import {Typography} from '../../components/Typography';

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState([
    {id: 1, colorTask: '#0FF', title: 'Tarefa 01 do dia D'},
    {id: 2, colorTask: '#0FF', title: 'Create the app'},
    {id: 3, colorTask: '#0FF', title: 'daily meeting with team'},
    {id: 4, colorTask: '#0FF', title: 'daily meeting with team'},
  ]);

  const [selectedTask, setSelectedTasks] = useState<number[]>([]);

  return (
    <Layout>
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
              colorTask={task.colorTask}
            />
          );
        })}
      </View>
      <TouchableOpacity
        onPress={() => {
          setTasks(old => [
            ...old,
            {id: 33, title: 'daily meeting with team', colorTask: '#0FF'},
          ]);
        }}>
        <Typography>Add</Typography>
      </TouchableOpacity>
    </Layout>
  );
};

export {HomeScreen};
