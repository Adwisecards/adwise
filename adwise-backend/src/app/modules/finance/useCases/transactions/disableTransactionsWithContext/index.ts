import { transactionRepo } from "../../../repo/transactions";
import { disableTransactionUseCase } from "../disableTransaction";
import { DisableTransactionsWithContextUseCase } from "./DisableTransactionsWithContextUseCase";

export const disableTransactionsWithContextUseCase = new DisableTransactionsWithContextUseCase(transactionRepo, disableTransactionUseCase);