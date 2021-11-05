import { paymentService } from "../../../../../services/paymentService";
import { userRepo } from "../../../repo/users";
import { RemoveCardFromUserController } from "./RemoveCardFromUserController";
import { RemoveCardFromUserUseCase } from "./RemoveCardFromUserUseCase";

export const removeCardFromUserUseCase = new RemoveCardFromUserUseCase(userRepo, paymentService);
export const removeCardFromUserController = new RemoveCardFromUserController(removeCardFromUserUseCase);