import { logger } from "../../../../services/logger";
import { ContactValidationService } from "./implementation/ContactValidationService";

const contactValidationService = new ContactValidationService(logger);

export {
    contactValidationService
};