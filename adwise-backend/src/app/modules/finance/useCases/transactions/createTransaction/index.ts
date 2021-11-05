import { globalRepo } from "../../../../administration/repo/globals";
import { createRefUseCase } from "../../../../ref/useCases/createRef";
import { transactionRepo } from "../../../repo/transactions";
import { recalculateWalletBalanceUseCase } from "../../wallets/recalculateWalletBalance";
import { disableTransactionsWithContextUseCase } from "../disableTransactionsWithContext";
import { CreateTransactionController } from "./CreateTransactionController";
import { CreateTransactionUseCase } from "./CreateTransactionUseCase";

export const createTransactionUseCase = new CreateTransactionUseCase(
    transactionRepo,
    createRefUseCase,
    recalculateWalletBalanceUseCase,
    disableTransactionsWithContextUseCase,
    globalRepo
);

export const createTransactionController = new CreateTransactionController(createTransactionUseCase);