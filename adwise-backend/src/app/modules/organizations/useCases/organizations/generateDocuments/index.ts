import { mediaService } from "../../../../../services/mediaService";
import { pdfService } from "../../../../../services/pdfService";
import { userRepo } from "../../../../users/repo/users";
import { organizationRepo } from "../../../repo/organizations";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { GenerateDocumentsUseCase } from "./GenerateDocumentsUseCase";

export const generateDocumentsUseCase = new GenerateDocumentsUseCase(
    userRepo,
    pdfService,
    mediaService,
    organizationRepo,
    organizationValidationService
);