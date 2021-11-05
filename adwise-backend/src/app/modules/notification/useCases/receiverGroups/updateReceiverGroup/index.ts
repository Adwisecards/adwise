import { purchaseRepo } from "../../../../finance/repo/purchases";
import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { clientRepo } from "../../../../organizations/repo/clients";
import { userRepo } from "../../../../users/repo/users";
import { receiverGroupRepo } from "../../../repo/receiverGroups";
import { getNotificationSettingsUseCase } from "../../notificationSettings/getNotificationSettings";
import { UpdateReceiverGroupController } from "./UpdateReceiverGroupController";
import { UpdateReceiverGroupUseCase } from "./UpdateReceiverGroupUseCase";

export const updateReceiverGroupUseCase = new UpdateReceiverGroupUseCase(
    userRepo,
    clientRepo,
    purchaseRepo,
    receiverGroupRepo,
    getNotificationSettingsUseCase
);

export const updateReceiverGroupController = new UpdateReceiverGroupController(updateReceiverGroupUseCase);