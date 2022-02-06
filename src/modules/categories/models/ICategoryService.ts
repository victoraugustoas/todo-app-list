export interface Category {
  title: string;
  colorCategory: string;
  id: string;
}

export interface ICategoryService {
  getCategory(data: {categoryID: string}): Promise<Category>;
}
