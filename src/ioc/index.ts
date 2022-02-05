import {Container} from 'inversify';
import {auth, fireStore} from '../../firebase';
import {TaskService} from '../modules/tasks/services/ITaskService';
import {Types} from './types';

const container = new Container({defaultScope: 'Singleton'});

container.bind(Types.FirebaseDB).toConstantValue(fireStore);
container.bind(Types.FirebaseAuth).toConstantValue(auth);

container.bind(Types.Task.ITaskService).to(TaskService);

export default container;
