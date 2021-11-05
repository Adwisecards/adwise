import { pdfService } from "../../../../../services/pdfService";
import { createMediaUseCase } from "../../../../media/useCases/createMedia";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { organizationStatisticsService } from "../../../../organizations/services/organizations/organizationStatisticsService";
import { userRepo } from "../../../../users/repo/users";
import { legalRepo } from "../../../repo/legal";
import { organizationDocumentRepo } from "../../../repo/organizationDocuments";
import { organizationDocumentValidationService } from "../../../services/organizationDocuments/organizationDocumentValidationService";
import { GenerateOrganizationDocumentController } from "./GenerateOrganizationDocumentController";
import { GenerateOrganizationDocumentUseCase } from "./GenerateOrganizationDocumentUseCase";

export const generateOrganizationDocumentUseCase = new GenerateOrganizationDocumentUseCase(
    userRepo,
    legalRepo,
    pdfService,
    organizationRepo,
    createMediaUseCase,
    organizationDocumentRepo,
    organizationStatisticsService,
    organizationDocumentValidationService
);

export const generateOrganizationDocumentController = new GenerateOrganizationDocumentController(
    generateOrganizationDocumentUseCase
);