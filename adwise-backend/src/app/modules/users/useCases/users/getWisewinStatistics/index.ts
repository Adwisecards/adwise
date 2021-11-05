import { wisewinService } from "../../../../../services/wisewinService";
import { transactionRepo } from "../../../../finance/repo/transactions";
import { walletRepo } from "../../../../finance/repo/wallets";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../repo/users";
import { getUserFinancialStatisticsUseCase } from "../getUserFinancialStatistics";
import { GetWisewinStatisticsController } from "./GetWisewinStatisticsController";
import { GetWisewinStatisticsUseCase } from "./GetWisewinStatisticsUseCase";

const getWisewinStatisticsUseCase = new GetWisewinStatisticsUseCase(userRepo, walletRepo, wisewinService, getUserFinancialStatisticsUseCase, organizationRepo, transactionRepo);
const getWisewinStatisticsController = new GetWisewinStatisticsController(getWisewinStatisticsUseCase);

export {
    getWisewinStatisticsUseCase,
    getWisewinStatisticsController
};