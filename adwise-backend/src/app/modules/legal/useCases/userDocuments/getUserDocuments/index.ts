import { userRepo } from "../../../../users/repo/users";
import { userDocumentRepo } from "../../../repo/userDocuments";
import { userDocumentValidationService } from "../../../services/userDocuments/userDocumentValidationService";
import { GetUserDocumentsController } from "./GetUserDocumentsController";
import { GetUserDocumentsUseCase } from "./GetUserDocumentsUseCase";

export const getUserDocumentsUseCase = new GetUserDocumentsUseCase(
    userRepo,
    userDocumentRepo,
    userDocumentValidationService
);

export const getUserDocumentsController = new GetUserDocumentsController(getUserDocumentsUseCase);