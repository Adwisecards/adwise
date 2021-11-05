import { telegramService } from "../../../../../services/telegramService";
import { clientRepo } from "../../../../organizations/repo/clients";
import { employeeRepo } from "../../../../organizations/repo/employees";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { subscriptionRepo } from "../../../repo/subscriptions";
import { subscriptionValidationService } from "../../../services/subscriptions/subscriptionValidationService";
import { createSubscriptionCreatedRecordUseCase } from "../../subscriptionCreatedRecords/createSubscriptionCreatedRecord";
import { CreateSubscriptionController } from "./CreateSubscriptionController";
import { CreateSubscriptionUseCase } from "./CreateSubscriptionUseCase";

const createSubscriptionUseCase = new CreateSubscriptionUseCase(
    subscriptionRepo, 
    organizationRepo, 
    userRepo, 
    subscriptionValidationService, 
    employeeRepo, 
    clientRepo, 
    createSubscriptionCreatedRecordUseCase,
    telegramService
);
const createSubscriptionController = new CreateSubscriptionController(createSubscriptionUseCase);

export {
    createSubscriptionUseCase,
    createSubscriptionController
};