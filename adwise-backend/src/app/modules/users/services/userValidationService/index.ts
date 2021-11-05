import { logger } from "../../../../services/logger";
import { UserValidationService } from "./implementation/UserValidationService";

const userValidationService = new UserValidationService(logger);

export {
    userValidationService
};