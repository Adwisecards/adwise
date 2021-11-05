import { mediaRepo } from "../../../../media/repo";
import { documentRepo } from "../../../repo/documents";
import { documentValidationService } from "../../../services/documentValidationService";
import { CreateDocumentController } from "./CreateDocumentController";
import { CreateDocumentUseCase } from "./CreateDocumentUseCase";

export const createDocumentUseCase = new CreateDocumentUseCase(
    mediaRepo,
    documentRepo,
    documentValidationService
);

export const createDocumentController = new CreateDocumentController(createDocumentUseCase);