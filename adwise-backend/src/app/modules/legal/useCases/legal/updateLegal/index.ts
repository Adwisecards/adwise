import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { legalRepo } from "../../../repo/legal";
import { legalValidationService } from "../../../services/legal/legalValidationService";
import { generateOrganizationDocumentUseCase } from "../../organizationDocuments/generateOrganizationDocument";
import { UpdateLegalUseCase } from "./UpdateLegalUseCase";

export const updateLegalUseCase = new UpdateLegalUseCase(
    userRepo,
    legalRepo,
    organizationRepo,
    legalValidationService,
    generateOrganizationDocumentUseCase
);