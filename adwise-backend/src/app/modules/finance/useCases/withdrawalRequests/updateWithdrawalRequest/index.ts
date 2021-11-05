import { withdrawalRequestRepo } from "../../../repo/withdrawalRequests";
import { withdrawalRequestValidationService } from "../../../services/withdrawalRequests/withdrawalRequestValidationService";
import { UpdateWithdrawalRequestController } from "./UpdateWithdrawalRequestController";
import { UpdateWithdrawalRequestUseCase } from "./UpdateWithdrawalRequestUseCase";

export const updateWithdrawalRequestUseCase = new UpdateWithdrawalRequestUseCase(
    withdrawalRequestRepo,
    withdrawalRequestValidationService
);

export const updateWithdrawalRequestController = new UpdateWithdrawalRequestController(updateWithdrawalRequestUseCase);