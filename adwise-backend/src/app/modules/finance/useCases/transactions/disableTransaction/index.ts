import { transactionRepo } from "../../../repo/transactions";
import { recalculateWalletBalanceUseCase } from "../../wallets/recalculateWalletBalance";
import { DisableTransactionController } from "./DisableTransactionController";
import { DisableTransactionUseCase } from "./DisableTransactionUseCase";

const disableTransactionUseCase = new DisableTransactionUseCase(transactionRepo, recalculateWalletBalanceUseCase);
const disableTransactionController = new DisableTransactionController(disableTransactionUseCase);

export {
    disableTransactionUseCase,
    disableTransactionController
};