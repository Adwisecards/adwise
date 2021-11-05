import { paymentService } from "../../../../../services/paymentService";
import { globalRepo } from "../../../../administration/repo/globals";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { accumulationRepo } from "../../../repo/accumulations";
import { paymentRepo } from "../../../repo/payments";
import { purchaseRepo } from "../../../repo/purchases";
import { tipsRepo } from "../../../repo/tips";
import { walletRepo } from "../../../repo/wallets";
import { calculatePurchaseMarketingUseCase } from "../../purchases/calculatePurchaseMarketing";
import { createTransactionUseCase } from "../../transactions/createTransaction";
import { ConfirmPaymentUseCase } from "./ConfirmPaymentUseCase";

export const confirmPaymentUseCase = new ConfirmPaymentUseCase(
    paymentRepo, 
    paymentService, 
    globalRepo, 
    tipsRepo, 
    userRepo, 
    createTransactionUseCase, 
    walletRepo, 
    purchaseRepo, 
    organizationRepo, 
    accumulationRepo,
    calculatePurchaseMarketingUseCase
);