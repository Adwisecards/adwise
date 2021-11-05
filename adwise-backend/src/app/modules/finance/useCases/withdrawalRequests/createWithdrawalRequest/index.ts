import { globalRepo } from "../../../../administration/repo/globals";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { walletRepo } from "../../../repo/wallets";
import { withdrawalRequestRepo } from "../../../repo/withdrawalRequests";
import { withdrawalRequestTokenService } from "../../../services/withdrawalRequests/withdrawalRequestTokenService";
import { CreateWithdrawalRequestController } from "./CreateWithdrawalRequestController";
import { CreateWithdrawalRequestUseCase } from "./CreateWithdrawalRequestUseCase";

const createWithdrawalRequestUseCase = new CreateWithdrawalRequestUseCase(withdrawalRequestRepo, organizationRepo, userRepo, walletRepo, withdrawalRequestTokenService, globalRepo);
const createWithdrawalRequestController = new CreateWithdrawalRequestController(createWithdrawalRequestUseCase);

export {
    createWithdrawalRequestUseCase,
    createWithdrawalRequestController
};