import { userRepo } from "../../../repo/users";
import { userValidationService } from "../../../services/userValidationService";
import { SetUserParentController } from "./SetUserParentController";
import { SetUserParentUseCase } from "./SetUserParentUseCase";

export const setUserParentUseCase = new SetUserParentUseCase(
    userRepo, 
    userValidationService
);

export const setUserParentController = new SetUserParentController(
    setUserParentUseCase
);