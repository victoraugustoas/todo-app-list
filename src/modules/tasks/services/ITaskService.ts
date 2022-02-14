import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {inject, injectable} from 'inversify';
import {Types} from '../../../ioc/types';
import {ICategoryService} from '../../categories/models/ICategoryService';
import {
  IParamListTasks,
  IParamObserverListTasks,
  IParamTask,
  ITaskService,
  Task,
  Unsubscribe,
} from '../models/ITaskService';

@injectable()
export class TaskService implements ITaskService {
  @inject(Types.Category.ICategoryService)
  private categoryService!: ICategoryService;

  private mountTask(data: IParamTask) {
    if (!auth().currentUser) throw new Error('User not logged');
    return {
      ...data,
      userID: auth().currentUser!.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
      selected: false,
    };
  }

  async save(data: IParamTask): Promise<void> {
    //save task
    await firestore().collection('tasks').add(this.mountTask(data));
  }

  async listTasks(data: IParamListTasks): Promise<Task[]> {
    let q = firestore()
      .collection('tasks')
      .orderBy('createdAt', 'desc')
      .where('userID', '==', auth().currentUser?.uid);

    if (data.filter?.category) {
      q = q.where('categoryID', '==', data.filter.category);
    }

    const snapshot = await q.get();
    const documents: Task[] = [];
    snapshot.forEach(doc => {
      const task: Task = {
        ...(doc.data() as Task),
        id: doc.id,
      };
      documents.push(task);
    });

    const hidrate = await Promise.all(
      documents.map(async task => {
        const category = await this.categoryService.getCategory({
          categoryID: task.categoryID,
        });
        return {...task, category};
      }),
    );

    return hidrate;
  }

  observerListTasks(data: IParamObserverListTasks): Unsubscribe {
    let q = firestore()
      .collection('tasks')
      .orderBy('createdAt', 'desc')
      .where('userID', '==', auth().currentUser?.uid);

    if (data.filter?.category) {
      q = q.where('categoryID', '==', data.filter.category);
    }

    const unsubscribe = q.onSnapshot(
      async querySnapshot => {
        data.setLoading && data.setLoading(true);
        const tasks: Task[] = [];
        querySnapshot.forEach(doc => {
          tasks.push({...(doc.data() as Task), id: doc.id});
        });

        const hidrate = await Promise.all(
          tasks.map(async task => {
            const category = await this.categoryService.getCategory({
              categoryID: task.categoryID,
            });
            return {...task, category};
          }),
        );

        data.save(hidrate);
        data.setLoading && data.setLoading(false);
      },
      error => {
        console.log(
          '🚀 ~ file: ITaskService.ts ~ line 120 ~ TaskService ~ observerListTasks ~ error',
          error,
        );
        data.setErrorLoading && data.setErrorLoading(true);
      },
    );
    return unsubscribe;
  }

  async getTask(taskID: string): Promise<Task> {
    const task = await firestore()
      .collection('tasks')
      .doc(taskID)
      .get({source: 'cache'});

    const category = await this.categoryService.getCategory({
      categoryID: (task.data() as Task).categoryID,
    });
    return {
      ...(task.data() as Task),
      category,
      id: task.id,
    };
  }

  async delete(taskID: string): Promise<void> {
    const task = await this.getTask(taskID);
    await firestore().collection('tasks').doc(taskID).delete();
  }

  async selectedOrNotTask(taskID: string): Promise<void> {
    const task = await this.getTask(taskID);

    firestore()
      .collection('tasks')
      .doc(taskID)
      .update({
        selected: !Boolean(task.selected),
        completedAt:
          !Boolean(task.selected) === false
            ? null
            : firestore.FieldValue.serverTimestamp(),
      });
  }
}
