import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllSubscriptionsController } from "./FindAllSubscriptionsController";
import { FindAllSubscriptionsUseCase } from "./FindAllSubscriptionsUseCase";

export const findAllSubscriptionsUseCase = new FindAllSubscriptionsUseCase(subscriptionRepo, administrationValidationService);
export const findAllSubscriptionsController = new FindAllSubscriptionsController(findAllSubscriptionsUseCase);