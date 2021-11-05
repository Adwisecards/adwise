import { mediaRepo } from "../../../../media/repo";
import { documentRepo } from "../../../repo/documents";
import { documentValidationService } from "../../../services/documentValidationService";
import { UpdateDocumentController } from "./UpdateDocumentController";
import { UpdateDocumentUseCase } from "./UpdateDocumentUseCase";

export const updateDocumentUseCase = new UpdateDocumentUseCase(
    mediaRepo,
    documentRepo,
    documentValidationService
);

export const updateDocumentController = new UpdateDocumentController(updateDocumentUseCase);