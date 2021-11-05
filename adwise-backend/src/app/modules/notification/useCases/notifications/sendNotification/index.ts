import { notificationService } from "../../../../../services/notificationService";
import { clientRepo } from "../../../../organizations/repo/clients";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { notificationRepo } from "../../../repo/notifications";
import { receiverGroupRepo } from "../../../repo/receiverGroups";
import { notificationValidationService } from "../../../services/notifications/notificationValidationService";
import { getNotificationSettingsUseCase } from "../../notificationSettings/getNotificationSettings";
import { SendNotificationController } from "./SendNotificationController";
import { SendNotificationUseCase } from "./SendNotificationUseCase";

export const sendNotificationUseCase = new SendNotificationUseCase(
    userRepo,
    clientRepo,
    notificationRepo,
    organizationRepo,
    receiverGroupRepo,
    notificationService,
    notificationValidationService,
    getNotificationSettingsUseCase
);

export const sendNotificationController = new SendNotificationController(sendNotificationUseCase);