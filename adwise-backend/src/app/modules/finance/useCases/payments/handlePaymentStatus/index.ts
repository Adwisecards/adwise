import { paymentService } from "../../../../../services/paymentService";
import { globalRepo } from "../../../../administration/repo/globals";
import { couponRepo } from "../../../../organizations/repo/coupons";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { paymentRepo } from "../../../repo/payments";
import { purchaseRepo } from "../../../repo/purchases";
import { tipsRepo } from "../../../repo/tips";
import { walletRepo } from "../../../repo/wallets";
import { accumulatePaymentUseCase } from "../../accumulations/accumulatePayment";
import { calculatePurchaseMarketingUseCase } from "../../purchases/calculatePurchaseMarketing";
import { cancelPurchaseUseCase } from "../../purchases/cancelPurchase";
import { confirmPurchaseUseCase } from "../../purchases/confirmPurchase";
import { createTransactionUseCase } from "../../transactions/createTransaction";
import { disableTransactionsWithContextUseCase } from "../../transactions/disableTransactionsWithContext";
import { confirmPaymentUseCase } from "../confirmPayment";
import { HandlePaymentStatusController } from "./HandlePaymentStatusController";
import { HandlePaymentStatusUseCase } from "./HandlePaymentStatusUseCase";

const handlePaymentStatusUseCase = new HandlePaymentStatusUseCase(
    paymentRepo,
    confirmPurchaseUseCase,
    paymentService,
    purchaseRepo,
    walletRepo,
    userRepo,
    couponRepo,
    createTransactionUseCase,
    organizationRepo,
    globalRepo,
    tipsRepo,
    calculatePurchaseMarketingUseCase,
    cancelPurchaseUseCase,
    accumulatePaymentUseCase,
    disableTransactionsWithContextUseCase
);
const handlePaymentStatusController = new HandlePaymentStatusController(handlePaymentStatusUseCase);

export {
    handlePaymentStatusUseCase,
    handlePaymentStatusController
};