import { userRepo } from "../../../repo/users";
import { userValidationService } from "../../../services/userValidationService";
import { GetUserTreeController } from "./GetUserTreeController";
import { GetUserTreeUseCase } from "./GetUserTreeUseCase";

export const getUserTreeUseCase = new GetUserTreeUseCase(
    userRepo,
    userValidationService
);

export const getUserTreeController = new GetUserTreeController(getUserTreeUseCase);