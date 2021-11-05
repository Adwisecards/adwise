import { legalRepo } from "../../../repo/legal";
import { legalValidationService } from "../../../services/legal/legalValidationService";
import { CheckLegalInnController } from "./CheckLegalInnController";
import { CheckLegalInnUseCase } from "./CheckLegalInnUseCase";

export const checkLegalInnUseCase = new CheckLegalInnUseCase(
    legalRepo,
    legalValidationService
);

export const checkLegalInnController = new CheckLegalInnController(checkLegalInnUseCase);