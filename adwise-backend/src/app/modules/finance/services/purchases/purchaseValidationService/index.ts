import { logger } from "../../../../../services/logger";
import { PurchaseValidationService } from "./implementation/PurchaseValidationService";

const purchaseValidationService = new PurchaseValidationService(logger);

export {
    purchaseValidationService
};