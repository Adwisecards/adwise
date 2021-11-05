import { purchaseRepo } from "../../../../finance/repo/purchases";
import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { userRepo } from "../../../../users/repo/users";
import { receiverGroupRepo } from "../../../repo/receiverGroups";
import { receiverGroupValidationService } from "../../../services/receiverGroups/receiverGroupValidationService";
import { updateReceiverGroupUseCase } from "../updateReceiverGroup";
import { CreateReceiverGroupController } from "./CreateReceiverGroupController";
import { CreateReceiverGroupUseCase } from "./CreateReceiverGroupUseCase";

export const createReceiverGroupUseCase = new CreateReceiverGroupUseCase(
    receiverGroupRepo,
    updateReceiverGroupUseCase,
    receiverGroupValidationService
);

export const createReceiverGroupController = new CreateReceiverGroupController(createReceiverGroupUseCase);