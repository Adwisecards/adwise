import { contactRepo } from "../../../../contacts/repo/contacts";
import { accumulationRepo } from "../../../../finance/repo/accumulations";
import { purchaseRepo } from "../../../../finance/repo/purchases";
import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { transactionRepo } from "../../../../finance/repo/transactions";
import { walletRepo } from "../../../../finance/repo/wallets";
import { withdrawalRequestRepo } from "../../../../finance/repo/withdrawalRequests";
import { calculatePurchaseMarketingUseCase } from "../../../../finance/useCases/purchases/calculatePurchaseMarketing";
import { userRepo } from "../../../../users/repo/users";
import { getUserFinancialStatisticsUseCase } from "../../../../users/useCases/userFinancialStatistics/getUserFinancialStatistics";
import { organizationRepo } from "../../../repo/organizations";
import { OrganizationStatisticsService } from "./implementation/OrganizationStatisticsService";

const organizationStatisticsService = new OrganizationStatisticsService(
    walletRepo,
    purchaseRepo,
    transactionRepo,
    subscriptionRepo,
    organizationRepo,
    calculatePurchaseMarketingUseCase,
    getUserFinancialStatisticsUseCase
);

export {
    organizationStatisticsService
};