import {Auth} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import {inject, injectable} from 'inversify';
import {Types} from '../../../ioc/types';
import {ICategoryService} from '../../categories/models/ICategoryService';
import {
  IParamListTasks,
  IParamObserverListTasks,
  IParamTask,
  ITaskService,
  Task,
} from '../models/ITaskService';

@injectable()
export class TaskService implements ITaskService {
  @inject(Types.FirebaseDB)
  private fireStore!: Firestore;
  @inject(Types.FirebaseAuth)
  private auth!: Auth;
  @inject(Types.Category.ICategoryService)
  private categoryService!: ICategoryService;

  private mountTask(data: IParamTask) {
    if (!this.auth.currentUser) throw new Error('User not logged');
    return {
      ...data,
      userID: this.auth.currentUser.uid,
      createdAt: serverTimestamp() as unknown as Date,
      selected: false,
    };
  }

  async save(data: IParamTask): Promise<void> {
    // update category with new task
    await this.categoryService.incrementCounters(data.categoryID, {
      numberOfTasks: 1,
    });
    //save task
    await addDoc(collection(this.fireStore, 'tasks'), this.mountTask(data));
  }

  async listTasks(data: IParamListTasks): Promise<Task[]> {
    const q = query(
      collection(this.fireStore, 'tasks'),
      orderBy('createdAt', 'desc'),
      where('userID', '==', this.auth.currentUser?.uid),
      ...(data.filter?.category
        ? [where('categoryID', '==', data.filter.category)]
        : []),
    );

    const docs = await getDocs(q);
    const documents: Task[] = [];
    docs.forEach(doc => {
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
    const q = query(
      collection(this.fireStore, 'tasks'),
      orderBy('createdAt', 'desc'),
      where('userID', '==', this.auth.currentUser?.uid),
    );

    const unsubscribe = onSnapshot(
      q,
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
          '???? ~ file: ITaskService.ts ~ line 120 ~ TaskService ~ observerListTasks ~ error',
          error,
        );
        data.setErrorLoading && data.setErrorLoading(true);
      },
    );
    return unsubscribe;
  }

  async getTask(taskID: string): Promise<Task> {
    const task = await getDoc(doc(this.fireStore, 'tasks', taskID));

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

    // update category
    await this.categoryService.incrementCounters(task.categoryID, {
      numberOfTasks: -1,
      totalTasksConcluded: task.selected ? -1 : 0,
    });

    await deleteDoc(doc(this.fireStore, 'tasks', taskID));
  }

  async selectedOrNotTask(taskID: string): Promise<void> {
    const task = await this.getTask(taskID);

    // update category
    await this.categoryService.incrementCounters(task.categoryID, {
      totalTasksConcluded: !Boolean(task.selected) ? 1 : -1,
    });

    await updateDoc(doc(this.fireStore, 'tasks', task.id), {
      selected: !Boolean(task.selected),
      completedAt: serverTimestamp(),
    });
  }
}
