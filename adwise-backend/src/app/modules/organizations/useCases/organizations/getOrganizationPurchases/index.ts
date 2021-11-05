import { xlsxService } from "../../../../../services/xlsxService";
import { purchaseRepo } from "../../../../finance/repo/purchases";
import { organizationRepo } from "../../../repo/organizations";
import { organizationStatisticsService } from "../../../services/organizations/organizationStatisticsService";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { GetOrganizationPurchasesController } from "./GetOrganizationPurchasesController";
import { GetOrganizationPurchasesUseCase } from "./GetOrganizationPurchasesUseCase";

const getOrganizationPurchasesUseCase = new GetOrganizationPurchasesUseCase(
    organizationRepo, 
    purchaseRepo, 
    organizationValidationService,
    xlsxService,
    organizationStatisticsService
);
const getOrganizationPurchasesController = new GetOrganizationPurchasesController(getOrganizationPurchasesUseCase);

export {
    getOrganizationPurchasesUseCase,
    getOrganizationPurchasesController
};