import { partnerRepo } from "../../../repo/partners";
import { partnerValidationService } from "../../../services/partnerValidationService";
import { CreatePartnerController } from "./CreatePartnerController";
import { CreatePartnerUseCase } from "./CreatePartnerUseCase";

export const createPartnerUseCase = new CreatePartnerUseCase(
    partnerRepo,
    partnerValidationService
);

export const createPartnerController = new CreatePartnerController(createPartnerUseCase);