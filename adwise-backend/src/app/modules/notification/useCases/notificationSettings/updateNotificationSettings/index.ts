import { notificationSettingsRepo } from "../../../repo/notificationSettings";
import { notificationSettingsValidationService } from "../../../services/notificationSettings/notificationSettingsValidationService";
import { getNotificationSettingsUseCase } from "../getNotificationSettings";
import { UpdateNotificationSettingsController } from "./UpdateNotificationSettingsController";
import { UpdateNotificationSettingsUseCase } from "./UpdateNotificationSettingsUseCase";

export const updateNotificationSettingsUseCase = new UpdateNotificationSettingsUseCase(
    notificationSettingsRepo,
    getNotificationSettingsUseCase,
    notificationSettingsValidationService
);

export const updateNotificationSettingsController = new UpdateNotificationSettingsController(updateNotificationSettingsUseCase);