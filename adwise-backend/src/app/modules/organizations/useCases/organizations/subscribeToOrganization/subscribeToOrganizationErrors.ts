import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { createSubscriptionErrors } from "../../../../finance/useCases/subscriptions/createSubscription/createSubscriptionErrors";
import { addCouponToContactErrors } from "../../coupons/addCouponToContact/addCouponToContactErrors";

export const subscribeToOrganizationErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('b'),
    UseCaseError.create('c'),
    UseCaseError.create('f'),
    UseCaseError.create('j'),
    UseCaseError.create('q'),
    UseCaseError.create('w'),
    UseCaseError.create('m'),
    ...addCouponToContactErrors,
    ...createSubscriptionErrors
];