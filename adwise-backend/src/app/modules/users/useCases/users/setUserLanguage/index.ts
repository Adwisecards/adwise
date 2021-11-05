import { userRepo } from "../../../repo/users";
import { userValidationService } from "../../../services/userValidationService";
import { SetUserLanguageController } from "./SetUserLanguageController";
import { SetUserLanguageUseCase } from "./SetUserLanguageUseCase";

export const setUserLanguageUseCase = new SetUserLanguageUseCase(
    userRepo,
    userValidationService
);

export const setUserLanguageController = new SetUserLanguageController(setUserLanguageUseCase);