import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { transactionRepo } from "../../../repo/transactions";
import { walletRepo } from "../../../repo/wallets";
import { GetWalletController } from "./GetWalletController";
import { GetWalletUseCase } from "./GetWalletUseCase";

export const getWalletUseCase = new GetWalletUseCase(organizationRepo, userRepo, walletRepo, transactionRepo);
export const getWalletController = new GetWalletController(getWalletUseCase);