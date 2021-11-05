import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { legalRepo } from "../../../repo/legal";
import { legalValidationService } from "../../../services/legal/legalValidationService";
import { generateOrganizationDocumentUseCase } from "../../organizationDocuments/generateOrganizationDocument";
import { CreateLegalController } from "./CreateLegalController";
import { CreateLegalUseCase } from "./CreateLegalUseCase";

export const createLegalUseCase = new CreateLegalUseCase(
    userRepo,
    legalRepo,
    organizationRepo,
    legalValidationService,
    generateOrganizationDocumentUseCase
);

export const createLegalController = new CreateLegalController(createLegalUseCase);