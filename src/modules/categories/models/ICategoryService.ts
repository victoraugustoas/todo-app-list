export interface Category {
  title: string;
  colorCategory: string;
  id: string;
  userID: string;
  numberOfTasks: number;
  totalTasksConcluded: number;
}

export interface IParamsUpdateCategory extends Partial<Category> {}

export interface ICategoryService {
  list(): Promise<Category[]>;
  getCategory(data: {categoryID: string}): Promise<Category>;
  update(categoryID: string, data: IParamsUpdateCategory): Promise<void>;
}
