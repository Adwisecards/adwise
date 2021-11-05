import { partnerRepo } from "../../../repo/partners";
import { partnerValidationService } from "../../../services/partnerValidationService";
import { DeletePartnerController } from "./DeletePartnerController";
import { DeletePartnerUseCase } from "./DeletePartnerUseCase";

export const deletePartnerUseCase = new DeletePartnerUseCase(
    partnerRepo,
    partnerValidationService
);

export const deletePartnerController = new DeletePartnerController(deletePartnerUseCase);