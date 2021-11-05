import { purchaseRepo } from "../../../../app/modules/finance/repo/purchases";
import { payPurchaseUseCase } from "../../../../app/modules/finance/useCases/purchases/payPurchase";
import { PayPurchasesTest } from "./PayPurchasesTest";

export const payPurchasesTest = new PayPurchasesTest(
    purchaseRepo,
    payPurchaseUseCase
);