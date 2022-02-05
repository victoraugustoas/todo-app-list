import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import React, {useCallback, useEffect, useState} from 'react';
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

  const deleteTask = useCallback(async (task: ITask) => {
    try {
      // await deleteDoc(doc(fireStore, 'tasks', task.id));
      await deleteDoc(doc(fireStore, 'tasks', task.id));
    } catch (error) {
      console.log('🚀 ~ file: index.tsx ~ line 44 ~ deleteTask ~ error', error);
    } finally {
    }
  }, []);

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
                onDimiss={() => deleteTask(task)}
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
