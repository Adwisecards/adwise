import { subscriptionRepo } from "../../../repo/subscriptions";
import { GetFirstLevelSubscriptionsController } from "./GetFirstLevelSubscriptionsController";
import { GetFirstLevelSubscriptionsUseCase } from "./GetFirstLevelSubscriptionsUseCase";

const getFirstLevelSubscriptionUseCase = new GetFirstLevelSubscriptionsUseCase(subscriptionRepo);
const getFirstLevelSubscriptionController = new GetFirstLevelSubscriptionsController(getFirstLevelSubscriptionUseCase);

export {
    getFirstLevelSubscriptionUseCase,
    getFirstLevelSubscriptionController
};