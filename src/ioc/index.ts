import {Container} from 'inversify';
import {auth, fireStore} from '../../firebase';
import {CategoryService} from '../modules/categories/services/CategoryService';
import {TaskService} from '../modules/tasks/services/ITaskService';
import {Types} from './types';

const container = new Container({defaultScope: 'Singleton'});

container.bind(Types.FirebaseDB).toConstantValue(fireStore);
container.bind(Types.FirebaseAuth).toConstantValue(auth);

container.bind(Types.Task.ITaskService).to(TaskService);
container.bind(Types.Category.ICategoryService).to(CategoryService);

export default container;
