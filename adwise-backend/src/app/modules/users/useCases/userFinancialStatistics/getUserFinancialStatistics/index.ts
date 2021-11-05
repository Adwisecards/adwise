import { walletRepo } from "../../../../finance/repo/wallets";
import { userFinancialStatisticsRepo } from "../../../repo/userFinancialStatistics";
import { userRepo } from "../../../repo/users";
import { updateUserFinancialStatisticsUseCase } from "../updateUserFinancialStatistics";
import { GetUserFinancialStatisticsController } from "./GetUserFinancialStatisticsController";
import { GetUserFinancialStatisticsUseCase } from "./GetUserFinancialStatisticsUseCase";

export const getUserFinancialStatisticsUseCase = new GetUserFinancialStatisticsUseCase(
    updateUserFinancialStatisticsUseCase,
    userFinancialStatisticsRepo,
    walletRepo,
    userRepo
);

export const getUserFinancicalStatisticsController = new GetUserFinancialStatisticsController(getUserFinancialStatisticsUseCase);