import { partnerRepo } from "../../../repo/partners";
import { partnerValidationService } from "../../../services/partnerValidationService";
import { UpdatePartnerController } from "./UpdatePartnerController";
import { UpdatePartnerUseCase } from "./UpdatePartnerUseCase";

export const updatePartnerUseCase = new UpdatePartnerUseCase(
    partnerRepo,
    partnerValidationService
);

export const updatePartnerController = new UpdatePartnerController(updatePartnerUseCase);