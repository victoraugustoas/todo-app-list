import {Auth} from 'firebase/auth';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {inject, injectable} from 'inversify';
import {Types} from '../../../ioc/types';
import {Category, ICategoryService} from '../models/ICategoryService';

@injectable()
export class CategoryService implements ICategoryService {
  @inject(Types.FirebaseDB)
  private fireStore!: Firestore;
  @inject(Types.FirebaseAuth)
  private auth!: Auth;

  public async getCategory(data: {categoryID: string}): Promise<Category> {
    const category = await getDoc(
      doc(this.fireStore, 'categories', data.categoryID),
    );

    return {...(category.data() as Category), id: category.id};
  }

  public async list(): Promise<Category[]> {
    const q = query(
      collection(this.fireStore, 'categories'),
      where('userID', '==', this.auth.currentUser?.uid),
    );

    const docs = await getDocs(q);
    const documents: Category[] = [];
    docs.forEach(doc => {
      const category: Category = {
        ...(doc.data() as Category),
        id: doc.id,
      };
      documents.push(category);
    });

    return documents;
  }
}
