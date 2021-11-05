import { organizationRepo } from "../../../../organizations/repo/organizations";
import { subscriptionRepo } from "../../../repo/subscriptions";
import { subscriptionValidationService } from "../../../services/subscriptions/subscriptionValidationService";
import { createSubscriptionCreatedRecordUseCase } from "../../subscriptionCreatedRecords/createSubscriptionCreatedRecord";
import { ChangeSubscriptionParentController } from "./ChangeSubscriptionParentController";
import { ChangeSubscriptionParentUseCase } from "./ChangeSubscriptionParentUseCase";

export const changeSubscriptionParentUseCase = new ChangeSubscriptionParentUseCase(
    organizationRepo,
    subscriptionRepo, 
    subscriptionValidationService,
    createSubscriptionCreatedRecordUseCase
);
export const changeSubscriptionParentController = new ChangeSubscriptionParentController(changeSubscriptionParentUseCase);