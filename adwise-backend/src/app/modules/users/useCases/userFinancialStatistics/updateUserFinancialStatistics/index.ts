import { timeService } from "../../../../../services/timeService";
import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { transactionRepo } from "../../../../finance/repo/transactions";
import { walletRepo } from "../../../../finance/repo/wallets";
import { userFinancialStatisticsRepo } from "../../../repo/userFinancialStatistics";
import { userRepo } from "../../../repo/users";
import { UpdateUserFinancialStatisticsUseCase } from "./UpdateUserFinancialStatisticsUseCase";

export const updateUserFinancialStatisticsUseCase = new UpdateUserFinancialStatisticsUseCase(
    walletRepo,
    userRepo,
    transactionRepo,
    subscriptionRepo,
    userFinancialStatisticsRepo
);

timeService.add(updateUserFinancialStatisticsUseCase);