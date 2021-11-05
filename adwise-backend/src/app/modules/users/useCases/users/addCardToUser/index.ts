import { paymentService } from "../../../../../services/paymentService";
import { createBankRequestUseCase } from "../../../../finance/useCases/bankRequests/createBankRequest";
import { userRepo } from "../../../repo/users";
import { AddCardToUserController } from "./AddCardToUserController";
import { AddCardToUserUseCase } from "./AddCardToUserUseCase";

export const addCardToUserUseCase = new AddCardToUserUseCase(createBankRequestUseCase, userRepo, paymentService);
export const addCardToUserController = new AddCardToUserController(addCardToUserUseCase);