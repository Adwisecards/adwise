import { contactRepo } from "../../../../contacts/repo/contacts";
import { userRepo } from "../../../../users/repo/users";
import { purchaseRepo } from "../../../repo/purchases";
import { walletRepo } from "../../../repo/wallets";
import { GetCashierPurchaseStatisticsController } from "./GetCashierPurchaseStatisticsController";
import { GetCashierPurchaseStatisticsUseCase } from "./GetCashierPurchaseStatisticsUseCase";

export const getCashierPurchaseStatisticsUseCase = new GetCashierPurchaseStatisticsUseCase(purchaseRepo, userRepo, contactRepo, walletRepo);
export const getCashierPurchaseStatisticsController = new GetCashierPurchaseStatisticsController(getCashierPurchaseStatisticsUseCase);