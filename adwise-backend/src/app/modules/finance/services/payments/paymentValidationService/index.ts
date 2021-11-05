import { logger } from "../../../../../services/logger";
import { PaymentValidationService } from "./implementation/PaymentValidationService";

const paymentValidationService = new PaymentValidationService(logger);

export {
    paymentValidationService
};