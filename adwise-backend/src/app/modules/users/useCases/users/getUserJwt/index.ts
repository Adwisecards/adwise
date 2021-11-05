import { userRepo } from '../../../repo/users';
import { authService } from '../../../services/authService';
import { GetUserJwtController } from './GetUserJwtController';
import { GetUserJwtUseCase } from './GetUserJwtUseCase';

const getUserJwtUseCase = new GetUserJwtUseCase(userRepo, authService);
const getUserJwtController = new GetUserJwtController(getUserJwtUseCase);

export {
    getUserJwtUseCase,
    getUserJwtController
};