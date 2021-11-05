import { tipsRepo } from "../../../../finance/repo/tips";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllTipsController } from "./FindAllTipsController";
import { FindAllTipsUseCase } from "./FindAllTipsUseCase";

export const findAllTipsUseCase = new FindAllTipsUseCase(tipsRepo, administrationValidationService);
export const findAllTipsController = new FindAllTipsController(findAllTipsUseCase);