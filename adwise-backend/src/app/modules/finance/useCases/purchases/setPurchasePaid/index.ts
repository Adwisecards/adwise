import { paymentService } from "../../../../../services/paymentService";
import { paymentRepo } from "../../../repo/payments";
import { purchaseRepo } from "../../../repo/purchases";
import { createPaymentUseCase } from "../../payments/createPayment";
import { handlePaymentStatusUseCase } from "../../payments/handlePaymentStatus";
import { disableTransactionsWithContextUseCase } from "../../transactions/disableTransactionsWithContext";
import { SetPurchasePaidController } from "./SetPurchasePaidController";
import { SetPurchasePaidUseCase } from "./SetPurchasePaidUseCase";

export const setPurchasePaidUseCase = new SetPurchasePaidUseCase(
    paymentRepo,
    purchaseRepo,
    paymentService,
    createPaymentUseCase,
    handlePaymentStatusUseCase,
    disableTransactionsWithContextUseCase
);

export const setPurchasePaidController = new SetPurchasePaidController(setPurchasePaidUseCase);