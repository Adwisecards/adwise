import { notificationSettingsRepo } from "../../../repo/notificationSettings";
import { GetNotificationSettingsController } from "./GetNotificationSettingsController";
import { GetNotificationSettingsUseCase } from "./GetNotificationSettingsUseCase";

export const getNotificationSettingsUseCase = new GetNotificationSettingsUseCase(notificationSettingsRepo);
export const getNotificationSettingsController = new GetNotificationSettingsController(getNotificationSettingsUseCase);