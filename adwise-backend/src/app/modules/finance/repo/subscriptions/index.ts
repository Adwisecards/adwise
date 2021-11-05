import { SubscriptionModel } from "../../models/Subscription";
import { SubscriptionRepo } from "./implementation/SubscriptionRepo";

const subscriptionRepo = new SubscriptionRepo(SubscriptionModel);

export {
    subscriptionRepo
};