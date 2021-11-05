import { paymentRepo } from '../../../repo/payments';
import { purchaseRepo } from '../../../repo/purchases';
import { BindPaymentsToPurchasesUseCase } from './BindPaymentsToPurchasesUseCase';

export const bindPaymentsToPurchasesUseCase = new BindPaymentsToPurchasesUseCase(
    paymentRepo,
    purchaseRepo
);