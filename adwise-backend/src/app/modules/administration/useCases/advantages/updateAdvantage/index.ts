import { advantageRepo } from "../../../repo/advantages";
import { advantageValidationService } from "../../../services/advantageValidationService";
import { UpdateAdvantageController } from "./UpdateAdvantageController";
import { UpdateAdvantageUseCase } from "./UpdateAdvantageUseCase";

export const updateAdvantageUseCase = new UpdateAdvantageUseCase(
    advantageRepo,
    advantageValidationService
);

export const updateAdvantageController = new UpdateAdvantageController(updateAdvantageUseCase);