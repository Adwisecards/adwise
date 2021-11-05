import { globalRepo } from "../../../../administration/repo/globals";
import { couponRepo } from "../../../../organizations/repo/coupons";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { offerRepo } from "../../../repo/offers";
import { purchaseValidationService } from "../../../services/purchases/purchaseValidationService";
import { calculateRefPaymentsUseCase } from "../../subscriptions/calculateRefPayments";
import { CalculatePurchaseMarketingUseCase } from "./CalculatePurchaseMarketingUseCase";

export const calculatePurchaseMarketingUseCase = new CalculatePurchaseMarketingUseCase(couponRepo, globalRepo, purchaseValidationService, offerRepo, calculateRefPaymentsUseCase, organizationRepo);
