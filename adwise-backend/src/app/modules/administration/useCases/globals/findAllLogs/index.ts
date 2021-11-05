import { logRepo } from "../../../../logs/repo";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllLogsController } from "./FindAllLogsController";
import { FindAllLogsUseCase } from "./FindAllLogsUseCase";

export const findAllLogsUseCase = new FindAllLogsUseCase(
    logRepo,
    administrationValidationService
);

export const findAllLogsController = new FindAllLogsController(findAllLogsUseCase);