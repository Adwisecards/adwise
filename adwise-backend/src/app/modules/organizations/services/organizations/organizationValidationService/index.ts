import { logger } from "../../../../../services/logger";
import { OrganizationValidationService } from "./implementation/OrganizationValidationService";

const organizationValidationService = new OrganizationValidationService(logger);

export {
    organizationValidationService
};