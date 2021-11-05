import { timeService } from "../../../../../services/timeService";
import { transactionRepo } from "../../../repo/transactions";
import { recalculateWalletBalanceUseCase } from "../../wallets/recalculateWalletBalance";
import { UnfreezeTransactionsUseCase } from "./UnfreezeTransactionsUseCase";

export const unfreezeTransactionsUseCase = new UnfreezeTransactionsUseCase(
    transactionRepo,
    recalculateWalletBalanceUseCase
);

timeService.add(unfreezeTransactionsUseCase);