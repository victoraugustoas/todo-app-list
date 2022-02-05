import {Unsubscribe} from 'firebase/auth';

export interface Category {
  title: string;
  colorCategory: string;
  id: string;
}

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
