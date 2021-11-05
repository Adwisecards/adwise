import { legalInfoRequestRepo } from "../../../../organizations/repo/legalInfoRequests";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllLegalInfoRequestsController } from "./FindAllLegalInfoRequestsController";
import { FindAllLegalInfoRequestsUseCase } from "./FindAllLegalInfoRequestsUseCase";

export const findAllLegalInfoRequestsUseCase = new FindAllLegalInfoRequestsUseCase(
    legalInfoRequestRepo,
    administrationValidationService
);

export const findAllLegalInfoRequestsController = new FindAllLegalInfoRequestsController(
    findAllLegalInfoRequestsUseCase
);