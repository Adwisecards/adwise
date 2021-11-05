import { xlsxService } from "../../../../../services/xlsxService";
import { purchaseRepo } from "../../../../finance/repo/purchases";
import { transactionRepo } from "../../../../finance/repo/transactions";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { getOrganizationStatisticsUseCase } from "../../../../organizations/useCases/organizationStatistics/getOrganizationStatistics";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllOrganizationsController } from "./FindAllOrganizationsController";
import { FindAllOrganizationsUseCase } from "./FindAllOrganizationsUseCase";

const findAllOrganizationsUseCase = new FindAllOrganizationsUseCase(
    administrationValidationService, 
    organizationRepo, 
    xlsxService, 
    transactionRepo, 
    getOrganizationStatisticsUseCase
);
const findAllOrganizationsController = new FindAllOrganizationsController(findAllOrganizationsUseCase);

export {
    findAllOrganizationsUseCase,
    findAllOrganizationsController
};