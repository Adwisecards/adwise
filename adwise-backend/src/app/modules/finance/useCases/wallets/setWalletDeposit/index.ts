import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { walletRepo } from "../../../repo/wallets";
import { walletValidationService } from "../../../services/wallets/walletValidationService";
import { createTransactionUseCase } from "../../transactions/createTransaction";
import { SetWalletDepositController } from "./SetWalletDepositController";
import { SetWalletDepositUseCase } from "./SetWalletDepositUseCase";

export const setWalletDepositUseCase = new SetWalletDepositUseCase(
    userRepo,
    walletRepo,
    organizationRepo,
    walletValidationService,
    createTransactionUseCase
);

export const setWalletDepositController = new SetWalletDepositController(
    setWalletDepositUseCase
);