import { withdrawalRequestRepo } from "../../../../finance/repo/withdrawalRequests";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllWithdrawalRequestsController } from "./FindAllWithdrawalRequestsController";
import { FindAllWithdrawalRequestsUseCase } from "./FindAllWithdrawalRequestsUseCase";

const findAllWithdrawalRequestsUseCase = new FindAllWithdrawalRequestsUseCase(withdrawalRequestRepo, administrationValidationService);
const findAllWithdrawalRequestsController = new FindAllWithdrawalRequestsController(findAllWithdrawalRequestsUseCase);

export {
    findAllWithdrawalRequestsUseCase,
    findAllWithdrawalRequestsController
};