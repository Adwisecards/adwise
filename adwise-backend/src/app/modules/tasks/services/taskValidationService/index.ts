import { logger } from "../../../../services/logger";
import { TaskValidationService } from "./implementation/TaskValidationService";

const taskValidationService = new TaskValidationService(logger);

export {
    taskValidationService
};