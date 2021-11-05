import { organizationRepo } from "../../../../organizations/repo/organizations";
import { organizationDocumentRepo } from "../../../repo/organizationDocuments";
import { organizationDocumentValidationService } from "../../../services/organizationDocuments/organizationDocumentValidationService";
import { GetOrganizationDocumentsController } from "./GetOrganizationDocumentsController";
import { GetOrganizationDocumentsUseCase } from "./GetOrganizationDocumentsUseCase";

export const getOrganizationDocumentsUseCase = new GetOrganizationDocumentsUseCase(
    organizationRepo,
    organizationDocumentRepo,
    organizationDocumentValidationService
);

export const getOrganizationDocumentsController = new GetOrganizationDocumentsController(getOrganizationDocumentsUseCase);