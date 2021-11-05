import { globalRepo } from "../../../repo/globals";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { UpdateGlobalController } from "./UpdateGlobalController";
import { UpdateGlobalUseCase } from "./UpdateGlobalUseCase";

const updateGlobalUseCase = new UpdateGlobalUseCase(globalRepo, administrationValidationService);
const updateGlobalController = new UpdateGlobalController(updateGlobalUseCase);

export {
    updateGlobalUseCase,
    updateGlobalController
};
