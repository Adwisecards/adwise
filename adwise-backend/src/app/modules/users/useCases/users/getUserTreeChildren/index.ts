import { userRepo } from "../../../repo/users";
import { userValidationService } from "../../../services/userValidationService";
import { GetUserTreeChildrenController } from "./GetUserTreeChildrenController";
import { GetUserTreeChildrenUseCase } from "./GetUserTreeChildrenUseCase";

export const getUserTreeChildrenUseCase = new GetUserTreeChildrenUseCase(userRepo, userValidationService);
export const getUserTreeChildrenController = new GetUserTreeChildrenController(getUserTreeChildrenUseCase);