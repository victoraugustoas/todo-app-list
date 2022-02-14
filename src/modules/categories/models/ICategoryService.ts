import {ObserverList, Unsubscribe} from '../../tasks/models/ITaskService';

export interface Category {
  title: string;
  colorCategory: string;
  id: string;
  userID: string;
  numberOfTasks: number;
  totalTasksConcluded: number;
}

export interface IParamsUpdateCategory extends Partial<Category> {}
export interface IParamsObserverListCategory extends ObserverList<Category[]> {}

export interface ICategoryService {
  list(): Promise<Category[]>;
  observerList(data: IParamsObserverListCategory): Unsubscribe;
  getCategory(data: {categoryID: string}): Promise<Category>;
  update(categoryID: string, data: IParamsUpdateCategory): Promise<void>;
}
