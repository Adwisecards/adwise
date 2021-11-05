import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { legalRepo } from "../../../repo/legal";
import { legalValidationService } from "../../../services/legal/legalValidationService";
import { UpdateLegalInfoController } from "./UpdateLegalInfoController";
import { UpdateLegalInfoUseCase } from "./UpdateLegalInfoUseCase";

export const updateLegalInfoUseCase = new UpdateLegalInfoUseCase(
    userRepo,
    legalRepo,
    organizationRepo,
    legalValidationService
);

export const updateLegalInfoController = new UpdateLegalInfoController(updateLegalInfoUseCase);