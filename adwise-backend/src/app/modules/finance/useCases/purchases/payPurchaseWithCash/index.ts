import { currencyService } from "../../../../../services/currencyService";
import { globalRepo } from "../../../../administration/repo/globals";
import { clientRepo } from "../../../../organizations/repo/clients";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { purchaseRepo } from "../../../repo/purchases";
import { walletRepo } from "../../../repo/wallets";
import { purchaseValidationService } from "../../../services/purchases/purchaseValidationService";
import { createCashPaymentUseCase } from "../../payments/createCashPayment";
import { addCommentToPurchaseUseCase } from "../addCommentToPurchase";
import { PayPurchaseWithCashController } from "./PayPurchaseWithCashController";
import { PayPurchaseWithCashUseCase } from "./PayPurchaseWithCashUseCase";

const payPurchaseWithCashUseCase = new PayPurchaseWithCashUseCase(
    purchaseRepo, 
    createCashPaymentUseCase, 
    userRepo, 
    walletRepo, 
    currencyService,
    globalRepo,
    organizationRepo,
    clientRepo,
    purchaseValidationService,
    addCommentToPurchaseUseCase
);
const payPurchaseWithCashController = new PayPurchaseWithCashController(payPurchaseWithCashUseCase);

export {
    payPurchaseWithCashUseCase,
    payPurchaseWithCashController
};