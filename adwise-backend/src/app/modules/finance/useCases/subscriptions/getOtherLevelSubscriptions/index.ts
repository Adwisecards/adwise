import { subscriptionRepo } from "../../../repo/subscriptions";
import { GetOtherLevelSubscriptionsController } from "./GetOtherLevelSubscriptionsController";
import { GetOtherLevelSubscriptionsUseCase } from "./GetOtherLevelSubscriptionsUseCase";

const getOtherLevelSubscriptionsUseCase = new GetOtherLevelSubscriptionsUseCase(subscriptionRepo);
const getOtherLevelSubscriptionsController = new GetOtherLevelSubscriptionsController(getOtherLevelSubscriptionsUseCase);

export {
    getOtherLevelSubscriptionsUseCase,
    getOtherLevelSubscriptionsController
};