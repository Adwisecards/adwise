import { couponRepo } from "../../../../organizations/repo/coupons";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { purchaseRepo } from "../../../repo/purchases";
import { subscriptionRepo } from "../../../repo/subscriptions";
import { subscriptionValidationService } from "../../../services/subscriptions/subscriptionValidationService";
import { CalculateRefPaymentsUseCase } from "./CalculateRefPaymentsUseCase";

export const calculateRefPaymentsUseCase = new CalculateRefPaymentsUseCase(
    subscriptionRepo,
    userRepo,
    organizationRepo,
    couponRepo,
    subscriptionValidationService
);