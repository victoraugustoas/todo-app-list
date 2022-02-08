export interface Category {
  title: string;
  colorCategory: string;
  id: string;
  userID: string;
}

export interface ICategoryService {
  list(): Promise<Category[]>;
  getCategory(data: {categoryID: string}): Promise<Category>;
}
