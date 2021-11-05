import { subscriptionRepo } from "../../../repo/subscriptions";
import { DeleteSubscriptionUseCase } from "./DeleteSubscriptionUseCase";

const deleteSubscriptionUseCase = new DeleteSubscriptionUseCase(subscriptionRepo);

export {
    deleteSubscriptionUseCase
};