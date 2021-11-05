import { userRepo } from '../../../repo/users';
import {GetUserByWisewinIdUseCase} from './GetUserByWisewinIdUseCase';
import {GetUserByWisewinIdController} from './GetUserByWisewinIdController';

const getUserByWisewinIdUseCase = new GetUserByWisewinIdUseCase(userRepo);
const getUserByWisewinIdController = new GetUserByWisewinIdController(getUserByWisewinIdUseCase);

export {
    getUserByWisewinIdUseCase,
    getUserByWisewinIdController
};