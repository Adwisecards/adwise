import { xlsxService } from "../../../../../services/xlsxService";
import { transactionRepo } from "../../../../finance/repo/transactions";
import { withdrawalRequestRepo } from "../../../../finance/repo/withdrawalRequests";
import { organizationRepo } from "../../../repo/organizations";
import { getOrganizationStatisticsUseCase } from "../../organizationStatistics/getOrganizationStatistics";
import { getOrganizationPurchasesUseCase } from "../getOrganizationPurchases";
import { GetOrganizationOperationsController } from "./GetOrganizationOperationsController";
import { GetOrganizationOperationsUseCase } from "./GetOrganizationOperationsUseCase";

const getOrganizationOperationsUseCase = new GetOrganizationOperationsUseCase(
    transactionRepo, 
    getOrganizationPurchasesUseCase,
    organizationRepo, 
    withdrawalRequestRepo,
    xlsxService,
    getOrganizationStatisticsUseCase
);
const getOrganizationOperationsController = new GetOrganizationOperationsController(getOrganizationOperationsUseCase);

export {
    getOrganizationOperationsUseCase,
    getOrganizationOperationsController
};