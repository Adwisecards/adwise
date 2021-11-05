import { purchaseRepo } from "../../../../finance/repo/purchases";
import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { transactionRepo } from "../../../../finance/repo/transactions";
import { walletRepo } from "../../../../finance/repo/wallets";
import { userRepo } from "../../../repo/users";
import { GetUserFinancialStatisticsController } from "./GetUserFinancialStatisticsController";
import { GetUserFinancialStatisticsUseCase } from "./GetUserFinancialStatisticsUseCase";

const getUserFinancialStatisticsUseCase = new GetUserFinancialStatisticsUseCase(
    walletRepo, 
    userRepo, 
    transactionRepo, 
    subscriptionRepo
);
const getUserFinancialStatisticsController = new GetUserFinancialStatisticsController(getUserFinancialStatisticsUseCase);

export {
    getUserFinancialStatisticsUseCase,
    getUserFinancialStatisticsController
};