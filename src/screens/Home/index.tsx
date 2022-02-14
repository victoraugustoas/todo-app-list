import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {CardCategory} from '../../components/CardCategory';
import {CardTask} from '../../components/CardTask';
import {Layout} from '../../components/Layout';
import {useIoCContext} from '../../contexts/IoCContext';
import {Types} from '../../ioc/types';
import {
  Category,
  ICategoryService,
} from '../../modules/categories/models/ICategoryService';
import {ITaskService, Task} from '../../modules/tasks/models/ITaskService';

const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);
  const [categoryID, setCategoryID] = useState<string | undefined>(undefined);
  const iocContext = useIoCContext();

  const taskService = iocContext.serviceContainer.get<ITaskService>(
    Types.Task.ITaskService,
  );
  const categoryService = iocContext.serviceContainer.get<ICategoryService>(
    Types.Category.ICategoryService,
  );

  const deleteTask = useCallback(async (task: Task) => {
    try {
      await taskService.delete(task.id);
    } catch (error) {
      console.log('🚀 ~ file: index.tsx ~ line 44 ~ deleteTask ~ error', error);
    } finally {
    }
  }, []);

  const completeTask = useCallback(async (task: Task) => {
    try {
      await taskService.selectedOrNotTask(task.id);
    } catch (error) {
      console.log(
        '🚀 ~ file: index.tsx ~ line 37 ~ completeTask ~ error',
        error,
      );
    } finally {
    }
  }, []);

  useEffect(() => categoryService.observerList({save: setCategories}), []);

  useEffect(
    () =>
      taskService.observerListTasks({
        save: setTasks,
        setLoading: setLoadingTasks,
        filter: {category: categoryID},
      }),
    [categoryID, taskService],
  );

  return (
    <Layout showAddButton>
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          contentContainerStyle={{padding: widthPercentageToDP(5)}}
          renderItem={({item}) => (
            <View key={item.id} style={{marginRight: widthPercentageToDP(2)}}>
              <CardCategory
                onPress={() => setCategoryID(item.id)}
                title={item.title}
                numberOfTasks={item.numberOfTasks}
                colorCategory={item.colorCategory}
                totalTasksConcluded={item.totalTasksConcluded}
              />
            </View>
          )}
          keyExtractor={value => value.id}
        />
      </View>
      <View style={{marginHorizontal: widthPercentageToDP(3), flex: 1}}>
        <FlatList
          data={tasks}
          keyExtractor={task => task.id}
          refreshing={loadingTasks}
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
