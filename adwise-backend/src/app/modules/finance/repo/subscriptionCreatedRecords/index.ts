import { SubscriptionCreatedRecordModel } from "../../models/SubscriptionCreatedRecord";
import { SubscriptionCreatedRecordRepo } from "./implementation/SubscriptionCreatedRecordRepo";

const subscriptionCreatedRecordRepo = new SubscriptionCreatedRecordRepo(SubscriptionCreatedRecordModel);

export {
    subscriptionCreatedRecordRepo
};