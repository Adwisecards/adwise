import { advantageRepo } from "../../../repo/advantages";
import { advantageValidationService } from "../../../services/advantageValidationService";
import { CreateAdvantageController } from "./CreateAdvantageController";
import { CreateAdvantageUseCase } from "./CreateAdvantageUseCase";

export const createAdvantageUseCase = new CreateAdvantageUseCase(
    advantageRepo,
    advantageValidationService
);

export const createAdvantageController = new CreateAdvantageController(createAdvantageUseCase);