import { paymentRepo } from "../../../repo/payments";
import { purchaseRepo } from "../../../repo/purchases";
import { paymentValidationService } from "../../../services/payments/paymentValidationService";
import { CreateCashPaymentUseCase } from "./CreateCashPaymentUseCase";

const createCashPaymentUseCase = new CreateCashPaymentUseCase(paymentRepo, paymentValidationService, purchaseRepo);

export {
    createCashPaymentUseCase
};