import { paymentRepo } from "../../../../app/modules/finance/repo/payments";
import { purchaseRepo } from "../../../../app/modules/finance/repo/purchases";
import { transactionRepo } from "../../../../app/modules/finance/repo/transactions";
import { handlePaymentStatusUseCase } from "../../../../app/modules/finance/useCases/payments/handlePaymentStatus";
import { calculatePurchaseMarketingUseCase } from "../../../../app/modules/finance/useCases/purchases/calculatePurchaseMarketing";
import { paymentService } from "../../../../app/services/paymentService";
import { HandlePaymentStatusTest } from "./HandlePaymentStatusTest";

export const handlePaymentStatusTest = new HandlePaymentStatusTest(
    paymentRepo,
    purchaseRepo,
    paymentService,
    transactionRepo,
    handlePaymentStatusUseCase,
    calculatePurchaseMarketingUseCase
);