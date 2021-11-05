import { userRepo } from "../../../../users/repo/users";
import { bankRequestRepo } from "../../../repo/bankRequests";
import { HandleBankRequestController } from "./HandleBankRequestController";
import { HandleBankRequestUseCase } from "./HandleBankRequestUseCase";

export const handleBankRequestUseCase = new HandleBankRequestUseCase(bankRequestRepo, userRepo);
export const handleBankRequestController = new HandleBankRequestController(handleBankRequestUseCase);