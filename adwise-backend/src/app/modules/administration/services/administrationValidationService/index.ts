import { logger } from "../../../../services/logger";
import { AdministrationValidationService } from "./implementation/AdministrationValidationService";

const administrationValidationService = new AdministrationValidationService(logger);

export {
    administrationValidationService
};