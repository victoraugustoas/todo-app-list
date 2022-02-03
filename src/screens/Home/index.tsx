import React, {useState} from 'react';
import {View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {CardTask} from '../../components/CardTask';
import {Layout} from '../../components/Layout';

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState([
    {id: 1, colorTask: '#0FF', title: 'Tarefa 01 do dia D'},
    {id: 2, colorTask: '#0FF', title: 'Create the app'},
    {id: 3, colorTask: '#0FF', title: 'daily meeting with team'},
    {id: 4, colorTask: '#0FF', title: 'daily meeting with team'},
    {id: 5, colorTask: '#08F', title: 'baby 🦈'},
  ]);

  const [selectedTask, setSelectedTasks] = useState<{
    [propID: number]: boolean;
  }>({});

  return (
    <Layout showAddButton>
      <View style={{marginHorizontal: widthPercentageToDP(3)}}>
        {tasks.map((task, idx) => {
          return (
            <CardTask
              style={{marginVertical: widthPercentageToDP(1.2)}}
              key={task.id}
              title={task.title}
              selected={selectedTask[task.id]}
              onPress={() =>
                setSelectedTasks(old => ({
                  ...old,
                  [task.id]: old[task.id] ? !old[task.id] : true,
                }))
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
    </Layout>
  );
};

export {HomeScreen};
