import {Auth} from 'firebase/auth';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import {inject, injectable} from 'inversify';
import {Types} from '../../../ioc/types';
import {
  Category,
  ICategoryService,
  IParamsObserverListCategory,
  IParamsUpdateCategory,
} from '../models/ICategoryService';

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

  async update(categoryID: string, data: IParamsUpdateCategory): Promise<void> {
    const document = doc(this.fireStore, 'categories', categoryID);
    await updateDoc(document, data);
  }

  observerList(data: IParamsObserverListCategory): Unsubscribe {
    const q = query(
      collection(this.fireStore, 'categories'),
      where('userID', '==', this.auth.currentUser?.uid),
    );

    const unsubscribe = onSnapshot(
      q,
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

  incrementCounters(
    categoryID: string,
    data: {
      numberOfTasks?: number | undefined;
      totalTasksConcluded?: number | undefined;
    },
  ): Promise<void> {
    const add = (a: number, b?: number) => {
      if (b) {
        return a + b < 0 ? 0 : a + b;
      }
      return a;
    };

    return runTransaction(this.fireStore, async transaction => {
      const docRef = doc(this.fireStore, 'categories', categoryID);
      const category = (await transaction.get(docRef)).data() as Category;

      transaction.update(docRef, {
        numberOfTasks: add(category.numberOfTasks, data.numberOfTasks),
        totalTasksConcluded: add(
          category.totalTasksConcluded,
          data.totalTasksConcluded,
        ),
      } as Partial<Category>);
    });
  }
}
