import { accumulationRepo } from "../../../../finance/repo/accumulations";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllAccumulationsController } from "./FindAllAccumulationsController";
import { FindAllAccumulationsUseCase } from "./FindAllAccumulationsUseCase";

export const findAllAccumulationsUseCase = new FindAllAccumulationsUseCase(accumulationRepo, administrationValidationService);
export const findAllAccumulationsController = new FindAllAccumulationsController(findAllAccumulationsUseCase);