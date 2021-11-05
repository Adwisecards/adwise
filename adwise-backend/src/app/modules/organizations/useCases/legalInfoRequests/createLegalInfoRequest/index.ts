import { emailService } from "../../../../../services/emailService";
import { mapsService } from "../../../../../services/mapsService";
import { globalRepo } from "../../../../administration/repo/globals";
import { legalRepo } from "../../../../legal/repo/legal";
import { addressRepo } from "../../../../maps/repo/addresses";
import { categoryRepo } from "../../../repo/categories";
import { legalInfoRequestRepo } from "../../../repo/legalInfoRequests";
import { organizationRepo } from "../../../repo/organizations";
import { legalInfoRequestValidationService } from "../../../services/legalInfoRequests/legalInfoRequestValidationService";
import { CreateLegalInfoRequestController } from "./CreateLegalInfoRequestController";
import { CreateLegalInfoRequestUseCase } from "./CreateLegalInfoRequestUseCase";

export const createLegalInfoRequestUseCase = new CreateLegalInfoRequestUseCase(
    legalRepo,
    globalRepo,
    addressRepo,
    mapsService,
    emailService,
    categoryRepo,
    organizationRepo,
    legalInfoRequestRepo,
    legalInfoRequestValidationService
);

export const createLegalInfoRequestController = new CreateLegalInfoRequestController(
    createLegalInfoRequestUseCase
);