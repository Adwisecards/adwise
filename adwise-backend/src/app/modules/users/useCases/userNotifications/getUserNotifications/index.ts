import { userNotificationRepo } from "../../../repo/userNotifications";
import { userRepo } from "../../../repo/users";
import { userNotificationValidationService } from "../../../services/userNotificationValidationService";
import { GetUserNotificationsController } from "./GetUserNotificationsController";
import { GetUserNotificationsUseCase } from "./GetUserNotificationsUseCase";

export const getUserNotificationsUseCase = new GetUserNotificationsUseCase(
    userRepo,
    userNotificationRepo,
    userNotificationValidationService
);

export const getUserNotificationsController = new GetUserNotificationsController(getUserNotificationsUseCase);