import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { getNotificationSettingsController } from "../../../useCases/notificationSettings/getNotificationSettings";
import { updateNotificationSettingsController } from "../../../useCases/notificationSettings/updateNotificationSettings";

export const notificationSettingsRouter = Router();

notificationSettingsRouter.get('/get-notification-settings', applyBlock, applyAuth, (req, res) => getNotificationSettingsController.execute(req, res));
notificationSettingsRouter.put('/update-notification-settings', applyBlock, applyAuth, (req, res) => updateNotificationSettingsController.execute(req, res));

/*
[
    {
        "name": "Get notification settings",
        "path": "/notifications/get-notification-settings",
        "dto": "src/app/modules/notification/useCases/notificationSettings/getNotificationSettings/GetNotificationSettingsDTO.ts",
        "errors": "src/app/modules/notification/useCases/notificationSettings/getNotificationSettings/getNotificationSettingsErrors.ts",
        "method": "GET",
        "description": "Возвращает настройки пуш уведомлений для пользователя."
    },
    {
        "name": "Update notification settings",
        "path": "/notifications/update-notification-settings",
        "dto": "src/app/modules/notification/useCases/notificationSettings/updateNotificationSettings/UpdateNotificationSettingsDTO.ts",
        "errors": "src/app/modules/notification/useCases/notificationSettings/updateNotificationSettings/updateNotificationSettingsErrors.ts",
        "method": "PUT",
        "description": "Обновляет настройки пуш уведомлений для пользователя."
    }
]
*/