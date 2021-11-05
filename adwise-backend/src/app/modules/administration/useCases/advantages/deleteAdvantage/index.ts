import { advantageRepo } from "../../../repo/advantages";
import { advantageValidationService } from "../../../services/advantageValidationService";
import { DeleteAdvantageController } from "./DeleteAdvantageController";
import { DeleteAdvantageUseCase } from "./DeleteAdvantageUseCase";

export const deleteAdvantageUseCase = new DeleteAdvantageUseCase(
    advantageRepo, 
    advantageValidationService
);
export const deleteAdvantageController = new DeleteAdvantageController(deleteAdvantageUseCase);