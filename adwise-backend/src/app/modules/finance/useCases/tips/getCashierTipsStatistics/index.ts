import { contactRepo } from "../../../../contacts/repo/contacts";
import { tipsRepo } from "../../../repo/tips";
import { GetCashierTipsStatisticsUseCase } from "./GetCashierTipsStatisticsUseCase";
import { GetCashierTipsStatisticsController } from './GetCashierTipsStatisticsController';
import { userRepo } from "../../../../users/repo/users";
import { transactionRepo } from "../../../repo/transactions";

export const getCashierTipsStatisticsUseCase = new GetCashierTipsStatisticsUseCase(transactionRepo, contactRepo, userRepo);
export const getCashierTipsStatisticsController = new GetCashierTipsStatisticsController(getCashierTipsStatisticsUseCase);