import { currencyService } from "../../../../../services/currencyService";
import { globalRepo } from "../../../../administration/repo/globals";
import { legalRepo } from "../../../../legal/repo/legal";
import { clientRepo } from "../../../../organizations/repo/clients";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { purchaseRepo } from "../../../repo/purchases";
import { walletRepo } from "../../../repo/wallets";
import { purchaseValidationService } from "../../../services/purchases/purchaseValidationService";
import { createPaymentUseCase } from "../../payments/createPayment";
import { addCommentToPurchaseUseCase } from "../addCommentToPurchase";
import { PayPurchaseController } from "./PayPurchaseController";
import { PayPurchaseUseCase } from "./PayPurchaseUseCase";

const payPurchaseUseCase = new PayPurchaseUseCase(
    userRepo, 
    createPaymentUseCase, 
    purchaseRepo, 
    walletRepo, 
    currencyService, 
    organizationRepo,
    globalRepo,
    clientRepo,
    purchaseValidationService,
    addCommentToPurchaseUseCase,
    legalRepo
);
const payPurchaseController = new PayPurchaseController(payPurchaseUseCase);

export {
    payPurchaseUseCase,
    payPurchaseController
};