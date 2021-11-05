import { subscriptionCreatedRecordRepo } from "../../../repo/subscriptionCreatedRecords";
import { CreateSubscriptionCreatedRecordUseCase } from "./CreateSubscriptionCreatedRecordUseCase";

const createSubscriptionCreatedRecordUseCase = new CreateSubscriptionCreatedRecordUseCase(subscriptionCreatedRecordRepo);

export {
    createSubscriptionCreatedRecordUseCase
};