import { organizationDocumentRepo } from "../../../repo/organizationDocuments";
import { organizationDocumentValidationService } from "../../../services/organizationDocuments/organizationDocumentValidationService";
import { GetOrganizationDocumentController } from "./GetOrganizationDocumentController";
import { GetOrganizationDocumentUseCase } from "./GetOrganizationDocumentUseCase";

export const getOrganizationDocumentUseCase = new GetOrganizationDocumentUseCase(
    organizationDocumentRepo,
    organizationDocumentValidationService
);

export const getOrganizationDocumentController = new GetOrganizationDocumentController(getOrganizationDocumentUseCase);