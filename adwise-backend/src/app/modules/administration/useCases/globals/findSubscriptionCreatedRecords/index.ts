import { subscriptionCreatedRecordRepo } from "../../../../finance/repo/subscriptionCreatedRecords";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindSubscriptionCreatedRecordsController } from "./FindSubscriptionCreatedRecordsController";
import { FindSubscriptionCreatedRecordsUseCase } from "./FindSubscriptionCreatedRecordsUseCase";

const findSubscriptionCreatedRecordsUseCase = new FindSubscriptionCreatedRecordsUseCase(subscriptionCreatedRecordRepo, administrationValidationService);
const findSubscriptionCreatedRecordsController = new FindSubscriptionCreatedRecordsController(findSubscriptionCreatedRecordsUseCase);

export {
    findSubscriptionCreatedRecordsUseCase,
    findSubscriptionCreatedRecordsController
};