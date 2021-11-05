import { subscriptionRepo } from "../../../repo/subscriptions";
import { GetLevelSubscriptionsController } from "./GetLevelSubscriptionsController";
import { GetLevelSubscriptionsUseCase } from "./GetLevelSubscriptionsUseCase";

const getLevelSubscriptionsUseCase = new GetLevelSubscriptionsUseCase(subscriptionRepo);
const getLevelSubscriptionsController = new GetLevelSubscriptionsController(getLevelSubscriptionsUseCase);

export {
    getLevelSubscriptionsController,
    getLevelSubscriptionsUseCase
};