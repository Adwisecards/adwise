import { cryptoService } from "../../../../../services/cryptoService";
import { walletRepo } from "../../../repo/wallets";
import { withdrawalRequestRepo } from "../../../repo/withdrawalRequests";
import { createTransactionUseCase } from "../../transactions/createTransaction";
import { SetWithdrawalRequestSatisfiedController } from "./SetWithdrawalRequestSatisfiedController";
import { SetWithdrawalRequestSatisfiedUseCase } from "./SetWithdrawalRequestSatisfiedUseCase";

const setWithdrawalRequestSatisfiedUseCase = new SetWithdrawalRequestSatisfiedUseCase(withdrawalRequestRepo, cryptoService, createTransactionUseCase, walletRepo);
const setWithdrawalRequestSatisfiedController = new SetWithdrawalRequestSatisfiedController(setWithdrawalRequestSatisfiedUseCase);

export {
    setWithdrawalRequestSatisfiedUseCase,
    setWithdrawalRequestSatisfiedController
};