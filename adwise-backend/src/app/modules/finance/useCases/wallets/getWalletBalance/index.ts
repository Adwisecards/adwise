import { userRepo } from "../../../../users/repo/users";
import { transactionRepo } from "../../../repo/transactions";
import { walletRepo } from "../../../repo/wallets";
import { walletValidationService } from "../../../services/wallets/walletValidationService";
import { GetWalletBalanceController } from "./GetWalletBalanceController";
import { GetWalletBalanceUseCase } from "./GetWalletBalanceUseCase";

export const getWalletBalanceUseCase = new GetWalletBalanceUseCase(
    userRepo,
    walletRepo,
    transactionRepo,
    walletValidationService
);

export const getWalletBalanceController = new GetWalletBalanceController(getWalletBalanceUseCase);