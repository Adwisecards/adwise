import { xlsxService } from "../../../../../services/xlsxService";
import { purchaseRepo } from "../../../../finance/repo/purchases";
import { transactionRepo } from "../../../../finance/repo/transactions";
import { organizationStatisticsService } from "../../../../organizations/services/organizations/organizationStatisticsService";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllPurchasesController } from "./FindAllPurchasesController";
import { FindAllPurchasesUseCase } from "./FindAllPurchasesUseCase";

const findAllPurchasesUseCase = new FindAllPurchasesUseCase(
    purchaseRepo, 
    administrationValidationService, 
    xlsxService,
    organizationStatisticsService
);
const findAllPurchasesController = new FindAllPurchasesController(findAllPurchasesUseCase);

export {
    findAllPurchasesUseCase,
    findAllPurchasesController
};