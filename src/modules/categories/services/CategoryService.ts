import {Auth} from 'firebase/auth';
import {doc, Firestore, getDoc} from 'firebase/firestore';
import {inject, injectable} from 'inversify';
import {Types} from '../../../ioc/types';
import {Category, ICategoryService} from '../models/ICategoryService';

@injectable()
export class CategoryService implements ICategoryService {
  @inject(Types.FirebaseDB)
  private fireStore!: Firestore;
  @inject(Types.FirebaseAuth)
  private auth!: Auth;

  async getCategory(data: {categoryID: string}): Promise<Category> {
    const category = await getDoc(
      doc(this.fireStore, 'categories', data.categoryID),
    );

    return {...(category.data() as Category), id: category.id};
  }
}
