import {CategoryTypes} from '../modules/categories/container';
import {TaskTypes} from '../modules/tasks/container';

export const Types = {
  Task: {...TaskTypes},
  Category: {...CategoryTypes},
  FirebaseDB: Symbol('FirebaseDB'),
  FirebaseAuth: Symbol('FirebaseAuth'),
};
