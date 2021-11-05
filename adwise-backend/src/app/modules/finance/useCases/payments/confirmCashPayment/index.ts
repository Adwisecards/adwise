import { couponRepo } from "../../../../organizations/repo/coupons";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { paymentRepo } from "../../../repo/payments";
import { purchaseRepo } from "../../../repo/purchases";
import { walletRepo } from "../../../repo/wallets";
import { confirmPurchaseUseCase } from "../../purchases/confirmPurchase";
import { createTransactionUseCase } from "../../transactions/createTransaction";
import { ConfirmCashPaymentController } from "./ConfirmCashPaymentController";
import { ConfirmCashPaymentUseCase } from "./ConfirmCashPaymentUseCase";

const confirmCashPaymentUseCase = new ConfirmCashPaymentUseCase(paymentRepo, confirmPurchaseUseCase, createTransactionUseCase, purchaseRepo, walletRepo, organizationRepo, userRepo, couponRepo);
const confirmCashPaymentController = new ConfirmCashPaymentController(confirmCashPaymentUseCase);

export {
    confirmCashPaymentUseCase,
    confirmCashPaymentController
};