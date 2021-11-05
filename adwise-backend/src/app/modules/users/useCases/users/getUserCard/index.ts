import { paymentService } from "../../../../../services/paymentService";
import { userRepo } from "../../../repo/users";
import { GetUserCardController } from "./GetUserCardController";
import { GetUserCardUseCase } from "./GetUserCardUseCase";

export const getUserCardUseCase = new GetUserCardUseCase(userRepo, paymentService);
export const getUserCardController = new GetUserCardController(getUserCardUseCase);