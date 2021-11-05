import { mediaService } from "../../../../../services/mediaService";
import { zipService } from "../../../../../services/zipService";
import { organizationRepo } from "../../../repo/organizations";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { GetOrganizationDocumentsController } from "./GetOrganizationDocumentsController";
import { GetOrganizationDocumentsUseCase } from "./GetOrganizationDocumentsUseCase";

export const getOrganizationDocumentsUseCase = new GetOrganizationDocumentsUseCase(
    zipService,
    mediaService,
    organizationRepo,
    organizationValidationService
);

export const getOrganizationDocumentsController = new GetOrganizationDocumentsController(getOrganizationDocumentsUseCase);