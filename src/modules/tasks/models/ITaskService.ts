import {Unsubscribe} from 'firebase/auth';
import {Category} from '../../categories/models/ICategoryService';

export interface Task {
  id: string;
  title: string;
  selected: boolean;
  category: Category;
  userID: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface IParamTask {
  title: string;
  categoryID: string;
}

export interface ITaskService {
  save(data: IParamTask): Promise<void>;
  listTasks(data: {setTasks: (tasks: Task[]) => void}): Unsubscribe;
}
