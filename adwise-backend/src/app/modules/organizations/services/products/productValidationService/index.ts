import { logger } from "../../../../../services/logger";
import { ProductValidationService } from "./implementation/ProductValidationService";

const productValidationService = new ProductValidationService(logger);

export {
    productValidationService
};