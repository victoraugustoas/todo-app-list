import {collection, onSnapshot, query} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {fireStore} from '../../../firebase';
import {CardTask} from '../../components/CardTask';
import {Layout} from '../../components/Layout';

interface ITask {
  id: string;
  title: string;
  colorTask: string;
}

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  useEffect(() => {
    const q = query(collection(fireStore, 'tasks'));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const tasks: ITask[] = [];
      querySnapshot.forEach(doc => {
        tasks.push({...(doc.data() as ITask), id: doc.id});
      });
      setTasks(tasks);
    });
    return () => unsubscribe();
  }, []);

  const [selectedTask, setSelectedTasks] = useState<{
    [propID: string]: boolean;
  }>({});

  return (
    <Layout showAddButton>
      <View style={{marginHorizontal: widthPercentageToDP(3)}}>
        <FlatList
          data={tasks}
          keyExtractor={task => task.id}
          renderItem={({item: task}) => {
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
                // onDimiss={() => {
                //   setTasks(oldState => {
                //     const copyOldState = [...oldState];
                //     copyOldState.splice(idx, 1);
                //     return copyOldState;
                //   });
                // }}
                colorTask={task.colorTask}
              />
            );
          }}
        />
      </View>
    </Layout>
  );
};

export {HomeScreen};
