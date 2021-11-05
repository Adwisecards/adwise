import { telegramService } from "../../../../../services/telegramService";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { walletRepo } from "../../../repo/wallets";
import { withdrawalRequestRepo } from "../../../repo/withdrawalRequests";
import { createTransactionUseCase } from "../../transactions/createTransaction";
import { SetLegalWithdrawalRequestSatisfiedController } from "./SetLegalWithdrawalRequestSatisfiedController";
import { SetLegalWithdrawalRequestSatisfiedUseCase } from "./SetLegalWithdrawalRequestSatisfiedUseCase";

const setLegalWithdrawalRequestSatisfiedUseCase = new SetLegalWithdrawalRequestSatisfiedUseCase(
    walletRepo,
    telegramService,
    organizationRepo,
    withdrawalRequestRepo, 
    createTransactionUseCase
);
const setLegalWithdrawalRequestSatisfiedController = new SetLegalWithdrawalRequestSatisfiedController(setLegalWithdrawalRequestSatisfiedUseCase);

export {
    setLegalWithdrawalRequestSatisfiedUseCase,
    setLegalWithdrawalRequestSatisfiedController
};