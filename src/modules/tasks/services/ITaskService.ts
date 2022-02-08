import {Auth, Unsubscribe} from 'firebase/auth';
import {
  addDoc,
  collection,
  Firestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import {inject, injectable} from 'inversify';
import {Types} from '../../../ioc/types';
import {ICategoryService} from '../../categories/models/ICategoryService';
import {IParamTask, ITaskService, Task} from '../models/ITaskService';

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
    await addDoc(collection(this.fireStore, 'tasks'), this.mountTask(data));
  }

  listTasks(data: {setTasks: (tasks: Task[]) => void}): Unsubscribe {
    const q = query(
      collection(this.fireStore, 'tasks'),
      orderBy('createdAt', 'desc'),
      where('userID', '==', this.auth.currentUser?.uid),
    );

    const unsubscribe = onSnapshot(q, async querySnapshot => {
      const tasks: Task[] = [];
      querySnapshot.forEach(doc => {
        tasks.push({
          ...(doc.data() as Task),
          category: {id: doc.data().categoryID, colorCategory: '', title: ''},
          id: doc.id,
        });
      });

      const hidrate = await Promise.all(
        tasks.map(async task => {
          const category = await this.categoryService.getCategory({
            categoryID: task.category.id,
          });
          return {...task, category};
        }),
      );

      data.setTasks(hidrate);
    });
    return unsubscribe;
  }
}