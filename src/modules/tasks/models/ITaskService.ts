import {Unsubscribe} from 'firebase/firestore';
import React from 'react';
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

export interface ObserverList<T> {
  save: React.Dispatch<React.SetStateAction<T>>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IParamObserverListTasks
  extends IParamListTasks,
    ObserverList<Task[]> {}

export interface ITaskService {
  save(data: IParamTask): Promise<void>;
  listTasks(data: IParamListTasks): Promise<Task[]>;
  observerListTasks(data: IParamObserverListTasks): Unsubscribe;
  delete(taskID: string): Promise<void>;
  getTask(taskID: string): Promise<Task>;
  selectedOrNotTask(taskID: string): Promise<void>;
}
