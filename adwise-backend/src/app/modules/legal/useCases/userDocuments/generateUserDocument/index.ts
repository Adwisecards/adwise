import { pdfService } from "../../../../../services/pdfService";
import { createMediaUseCase } from "../../../../media/useCases/createMedia";
import { userRepo } from "../../../../users/repo/users";
import { userDocumentRepo } from "../../../repo/userDocuments";
import { userDocumentValidationService } from "../../../services/userDocuments/userDocumentValidationService";
import { GenerateUserDocumentUseCase } from "./GenerateUserDocumentUseCase";

export const generateUserDocumentUseCase = new GenerateUserDocumentUseCase(
    userRepo,
    pdfService,
    userDocumentRepo,
    createMediaUseCase,
    userDocumentValidationService
);