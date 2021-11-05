import { contactRepo } from "../../../../contacts/repo/contacts";
import { userRepo } from "../../../../users/repo/users";
import { tipsRepo } from "../../../repo/tips";
import { transactionRepo } from "../../../repo/transactions";
import { tipsValidationService } from "../../../services/tips/tipsValidationService";
import { GetCashierTipsController } from "./GetCashierTipsController";
import { GetCashierTipsUseCase } from "./GetCashierTipsUseCase";

export const getCashierTipsUseCase = new GetCashierTipsUseCase(transactionRepo, userRepo, tipsValidationService, contactRepo);
export const getCashierTipsController = new GetCashierTipsController(getCashierTipsUseCase);