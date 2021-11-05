import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { walletRepo } from "../../../repo/wallets";
import { createTransactionUseCase } from "../../transactions/createTransaction";
import { DepositWalletController } from "./DepositWalletController";
import { DepositWalletUseCase } from "./DepositWalletUseCase";

const depositWalletUseCase = new DepositWalletUseCase(userRepo, walletRepo, organizationRepo, createTransactionUseCase);
const depositWalletController = new DepositWalletController(depositWalletUseCase);

export {
    depositWalletUseCase,
    depositWalletController
};