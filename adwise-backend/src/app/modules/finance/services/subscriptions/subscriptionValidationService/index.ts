import { logger } from "../../../../../services/logger";
import { SubscriptionValidationService } from "./implementation/SubscriptionValidationService";

const subscriptionValidationService = new SubscriptionValidationService(logger);

export {
    subscriptionValidationService
};