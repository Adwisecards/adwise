import { documentRepo } from "../../../repo/documents";
import { documentValidationService } from "../../../services/documentValidationService";
import { GetDocumentsByTypeController } from "./GetDocumentsByTypeController";
import { GetDocumentsByTypeUseCase } from "./GetDocumentsByTypeUseCase";

export const getDocumentsByTypeUseCase = new GetDocumentsByTypeUseCase(
    documentRepo,
    documentValidationService
);

export const getDocumentsByTypeController = new GetDocumentsByTypeController(getDocumentsByTypeUseCase);