import { timeService } from "../../../../../services/timeService";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { walletRepo } from "../../../repo/wallets";
import { getAllWalletTransactionsUseCase } from "../../transactions/getAllWalletTransactionsSum";
import { RecalculateWalletBalanceUseCase } from "./RecalculateWalletBalanceUseCase";

const recalculateWalletBalanceUseCase = new RecalculateWalletBalanceUseCase(walletRepo, getAllWalletTransactionsUseCase, organizationRepo);

export {
    recalculateWalletBalanceUseCase
};

timeService.add(recalculateWalletBalanceUseCase);