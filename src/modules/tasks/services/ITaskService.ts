import {Auth, Unsubscribe} from 'firebase/auth';
import {
  addDoc,
  collection,
  Firestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {inject, injectable} from 'inversify';
import {Types} from '../../../ioc/types';
import {ITaskService, Task} from '../models/ITaskService';

@injectable()
export class TaskService implements ITaskService {
  @inject(Types.FirebaseDB)
  private fireStore!: Firestore;
  @inject(Types.FirebaseAuth)
  private auth!: Auth;

  private mountTask(data: Omit<Task, 'id' | 'userID'>): Omit<Task, 'id'> {
    if (!this.auth.currentUser) throw new Error('User not logged');
    return {...data, userID: this.auth.currentUser.uid};
  }

  async save(data: Omit<Task, 'id' | 'userID'>): Promise<void> {
    await addDoc(collection(this.fireStore, 'tasks'), this.mountTask(data));
  }

  listTasks(data: {setTasks: (tasks: Task[]) => void}): Unsubscribe {
    const q = query(
      collection(this.fireStore, 'tasks'),
      where('userID', '==', this.auth.currentUser?.uid),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const tasks: Task[] = [];
      querySnapshot.forEach(doc => {
        tasks.push({...(doc.data() as Task), id: doc.id});
      });
      data.setTasks(tasks);
    });
    return unsubscribe;
  }
}
