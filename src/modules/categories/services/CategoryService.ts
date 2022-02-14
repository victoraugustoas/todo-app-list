import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {injectable} from 'inversify';
import {Unsubscribe} from '../../tasks/models/ITaskService';
import {
  Category,
  ICategoryService,
  IParamsObserverListCategory,
  IParamsUpdateCategory,
} from '../models/ICategoryService';

@injectable()
export class CategoryService implements ICategoryService {
  public async getCategory(data: {categoryID: string}): Promise<Category> {
    const category = await firestore()
      .collection('categories')
      .doc(data.categoryID)
      .get({source: 'cache'});

    return {...(category.data() as Category), id: category.id};
  }

  public async list(): Promise<Category[]> {
    const docs = await firestore()
      .collection('categories')
      .where('userID', '==', auth().currentUser?.uid)
      .get();

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

  async update(categoryID: string, data: IParamsUpdateCategory): Promise<void> {
    await firestore().collection('categories').doc(categoryID).update(data);
  }

  observerList(data: IParamsObserverListCategory): Unsubscribe {
    const q = firestore()
      .collection('categories')
      .where('userID', '==', auth().currentUser?.uid);

    const unsubscribe = q.onSnapshot(
      async querySnapshot => {
        data.setLoading && data.setLoading(true);
        const categories: Category[] = [];
        querySnapshot.forEach(doc => {
          categories.push({...(doc.data() as Category), id: doc.id});
        });
        data.save(categories);
        data.setLoading && data.setLoading(false);
      },
      error => {
        console.log(
          '🚀 ~ file: CategoryService.ts ~ line 91 ~ CategoryService ~ observerList ~ error',
          error,
        );
        data.setErrorLoading && data.setErrorLoading(true);
      },
    );
    return unsubscribe;
  }
}
