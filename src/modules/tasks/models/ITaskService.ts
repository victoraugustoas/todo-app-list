import {Category} from '../../categories/models/ICategoryService';

export interface Task {
  id: string;
  title: string;
  selected: boolean;
  categoryID: string;
  category: Category;
  userID: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface IParamTask {
  title: string;
  categoryID: string;
}
export interface IParamListTasks {
  filter?: {category?: string};
}

export interface ITaskService {
  save(data: IParamTask): Promise<void>;
  listTasks(data: IParamListTasks): Promise<Task[]>;
}
