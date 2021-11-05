import { logRepo } from "../../repo";
import { logValidationService } from "../../services/logValidationService";
import { CreateLogController } from "./CreateLogController";
import { CreateLogUseCase } from "./CreateLogUseCase";

export const createLogUseCase = new CreateLogUseCase(logRepo, logValidationService);
export const createLogController = new CreateLogController(createLogUseCase);