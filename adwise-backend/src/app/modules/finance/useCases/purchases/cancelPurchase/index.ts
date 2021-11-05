import { paymentService } from "../../../../../services/paymentService";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { accumulationRepo } from "../../../repo/accumulations";
import { paymentRepo } from "../../../repo/payments";
import { purchaseRepo } from "../../../repo/purchases";
import { transactionRepo } from "../../../repo/transactions";
import { walletRepo } from "../../../repo/wallets";
import { createTransactionUseCase } from "../../transactions/createTransaction";
import { disableTransactionUseCase } from "../../transactions/disableTransaction";
import { calculatePurchaseMarketingUseCase } from "../calculatePurchaseMarketing";
import { CancelPurchaseController } from "./CancelPurchaseController";
import { CancelPurchaseUseCase } from "./CancelPurchaseUseCase";

export const cancelPurchaseUseCase = new CancelPurchaseUseCase(
    userRepo,
    walletRepo,
    paymentRepo,
    purchaseRepo,
    paymentService,
    transactionRepo,
    accumulationRepo,
    organizationRepo,
    createTransactionUseCase,
    disableTransactionUseCase,
    calculatePurchaseMarketingUseCase
);
export const cancelPurchaseController = new CancelPurchaseController(cancelPurchaseUseCase);