import { walletRepo } from "../../../repo/wallets";
import { createTransactionUseCase } from "../../transactions/createTransaction";
import { CorrectBalanceController } from "./CorrectBalanceController";
import { CorrectBalanceUseCase } from "./CorrectBalanceUseCase";

const correctBalanceUseCase = new CorrectBalanceUseCase(walletRepo, createTransactionUseCase);
const correctBalanceController = new CorrectBalanceController(correctBalanceUseCase);

export {
    correctBalanceUseCase,
    correctBalanceController
};