import { userRepo } from "../../../../users/repo/users";
import { purchaseRepo } from "../../../repo/purchases";
import { transactionRepo } from "../../../repo/transactions";
import { walletRepo } from "../../../repo/wallets";
import { RepointPurchasesUseCase } from "./RepointPurchasesUseCase";

export const repointPurchasesUseCase = new RepointPurchasesUseCase(purchaseRepo, walletRepo, transactionRepo, userRepo); 