import {deleteDoc, doc, serverTimestamp, updateDoc} from 'firebase/firestore';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {fireStore} from '../../../firebase';
import {CardTask} from '../../components/CardTask';
import {Layout} from '../../components/Layout';
import {useIoCContext} from '../../contexts/IoCContext';
import {Types} from '../../ioc/types';
import {ITaskService, Task} from '../../modules/tasks/models/ITaskService';

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const iocContext = useIoCContext();
  console.log('🚀 ~ file: index.tsx ~ line 15 ~ tasks', tasks);

  const taskService = iocContext.serviceContainer.get<ITaskService>(
    Types.Task.ITaskService,
  );

  useEffect(() => {
    const unsubscribe = taskService.listTasks({setTasks});
    return () => unsubscribe();
  }, []);

  const deleteTask = useCallback(async (task: Task) => {
    try {
      await deleteDoc(doc(fireStore, 'tasks', task.id));
    } catch (error) {
      console.log('🚀 ~ file: index.tsx ~ line 44 ~ deleteTask ~ error', error);
    } finally {
    }
  }, []);

  const completeTask = useCallback(async (task: Task) => {
    try {
      await updateDoc(doc(fireStore, 'tasks', task.id), {
        selected: !Boolean(task.selected),
        completedAt: serverTimestamp(),
      });
    } catch (error) {
    } finally {
    }
  }, []);

  return (
    <Layout showAddButton>
      <View style={{marginHorizontal: widthPercentageToDP(3), flex: 1}}>
        <FlatList
          data={tasks}
          keyExtractor={task => task.id}
          renderItem={({item: task, index}) => {
            return (
              <CardTask
                key={task.id}
                index={index}
                style={{marginVertical: widthPercentageToDP(1.2)}}
                title={task.title}
                selected={task.selected}
                onPress={() => completeTask(task)}
                onDimiss={() => deleteTask(task)}
                colorTask={task.category.colorCategory}
              />
            );
          }}
        />
      </View>
    </Layout>
  );
};

export {HomeScreen};
