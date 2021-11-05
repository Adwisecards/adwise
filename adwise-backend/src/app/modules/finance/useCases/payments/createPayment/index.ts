import { paymentService } from "../../../../../services/paymentService";
import { globalRepo } from "../../../../administration/repo/globals";
import { legalRepo } from "../../../../legal/repo/legal";
import { couponRepo } from "../../../../organizations/repo/coupons";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { accumulationRepo } from "../../../repo/accumulations";
import { paymentRepo } from "../../../repo/payments";
import { purchaseRepo } from "../../../repo/purchases";
import { tipsRepo } from "../../../repo/tips";
import { paymentValidationService } from "../../../services/payments/paymentValidationService";
import { calculatePurchaseMarketingUseCase } from "../../purchases/calculatePurchaseMarketing";
import { CreatePaymentUseCase } from "./CreatePaymentUseCase";

const createPaymentUseCase = new CreatePaymentUseCase(paymentRepo, 
    paymentValidationService,
    paymentService, purchaseRepo,
    globalRepo,
    organizationRepo,
    couponRepo,
    calculatePurchaseMarketingUseCase,
    accumulationRepo,
    tipsRepo,
    legalRepo
);

export {
    createPaymentUseCase
}