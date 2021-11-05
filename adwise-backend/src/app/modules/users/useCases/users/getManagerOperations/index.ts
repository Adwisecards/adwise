import { transactionRepo } from "../../../../finance/repo/transactions";
import { userRepo } from "../../../repo/users";
import { userValidationService } from "../../../services/userValidationService";
import { GetManagerOperationsUseCase } from "./GetManagerOperationsUseCase";
import { GetManagerOperationsController } from './GetManagerOperationsController';

export const getManagerOperationsUseCase = new GetManagerOperationsUseCase(userRepo, transactionRepo, userValidationService);
export const getManagerOperationsController = new GetManagerOperationsController(getManagerOperationsUseCase);