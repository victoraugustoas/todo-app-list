import {TaskTypes} from '../modules/tasks/container';

export const Types = {
  Task: {...TaskTypes},
  FirebaseDB: Symbol('FirebaseDB'),
  FirebaseAuth: Symbol('FirebaseAuth'),
};
