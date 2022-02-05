import {Unsubscribe} from 'firebase/auth';

export interface Task {
  id: string;
  title: string;
  colorTask: string;
  selected: boolean;
  userID: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface ITaskService {
  save(data: Omit<Task, 'id' | 'userID'>): Promise<void>;
  listTasks(data: {setTasks: (tasks: Task[]) => void}): Unsubscribe;
}
