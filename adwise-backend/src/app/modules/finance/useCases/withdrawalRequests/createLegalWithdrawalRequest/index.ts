import { emailService } from "../../../../../services/emailService";
import { globalRepo } from "../../../../administration/repo/globals";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { walletRepo } from "../../../repo/wallets";
import { withdrawalRequestRepo } from "../../../repo/withdrawalRequests";
import { withdrawalRequestValidationService } from "../../../services/withdrawalRequests/withdrawalRequestValidationService";
import { CreateLegalWithdrawalRequestController } from "./CreateLegalWithdrawalRequestController";
import { CreateLegalWithdrawalRequestUseCase } from "./CreateLegalWithdrawalRequestUseCase";

const createLegalWithdrawalRequestUseCase = new CreateLegalWithdrawalRequestUseCase(withdrawalRequestRepo, userRepo, organizationRepo, withdrawalRequestValidationService, walletRepo, globalRepo, emailService);
const createLegalWithdrawalRequestController = new CreateLegalWithdrawalRequestController(createLegalWithdrawalRequestUseCase);

export {
    createLegalWithdrawalRequestUseCase,
    createLegalWithdrawalRequestController
};