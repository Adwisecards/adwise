import { logger } from "../../../../../services/logger";
import { EmployeeRatingValidationService } from "./implementation/EmployeeRatingValidationService";

export const employeeRatingValidationService = new EmployeeRatingValidationService(logger);