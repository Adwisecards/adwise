import { advantageRepo } from "../../../repo/advantages";
import { advantageValidationService } from "../../../services/advantageValidationService";
import { GetAdvantagesController } from "./GetAdvantagesController";
import { GetAdvantagesUseCase } from "./GetAdvantagesUseCase";

export const getAdvantagesUseCase = new GetAdvantagesUseCase(
    advantageRepo,
    advantageValidationService
);

export const getAdvantagesController = new GetAdvantagesController(getAdvantagesUseCase);