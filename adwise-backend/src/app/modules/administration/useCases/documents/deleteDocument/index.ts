import { documentRepo } from "../../../repo/documents";
import { documentValidationService } from "../../../services/documentValidationService";
import { DeleteDocumentController } from "./DeleteDocumentController";
import { DeleteDocumentUseCase } from "./DeleteDocumentUseCase";

export const deleteDocumentUseCase = new DeleteDocumentUseCase(
    documentRepo,
    documentValidationService
);

export const deleteDocumentController = new DeleteDocumentController(deleteDocumentUseCase);