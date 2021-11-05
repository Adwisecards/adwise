import { userNotificationRepo } from "../../../repo/userNotifications";
import { userRepo } from "../../../repo/users";
import { userNotificationValidationService } from "../../../services/userNotificationValidationService";
import { GetUnseenUserNotificationCountController } from "./GetUnseenUserNotificationCountController";
import { GetUnseenUserNotificationCountUseCase } from "./GetUnseenUserNotificationCountUseCase";

export const getUnseenUserNotificationCountUseCase = new GetUnseenUserNotificationCountUseCase(
    userRepo,
    userNotificationRepo,
    userNotificationValidationService
);

export const getUnseenUserNotificationCountController = new GetUnseenUserNotificationCountController(
    getUnseenUserNotificationCountUseCase
);