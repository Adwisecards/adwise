import { logger } from "../../../../../services/logger";
import { WithdrawalRequestValidationService } from "./implementation/WithdrawalRequestValidationService";

const withdrawalRequestValidationService = new WithdrawalRequestValidationService(logger);

export {
    withdrawalRequestValidationService
};