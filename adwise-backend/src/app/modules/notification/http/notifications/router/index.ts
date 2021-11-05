import { Router } from "express";
import { applyAdmin, applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { getOrganizationNotificationsController } from "../../../useCases/notifications/getOrganizationNotifications";
import { sendNotificationController } from "../../../useCases/notifications/sendNotification";

export const notificationRouter = Router();

notificationRouter.post('/send-notification', applyBlock, applyAuth, (req, res) => sendNotificationController.execute(req, res));
notificationRouter.get('/get-organization-notifications/:id', applyBlock, applyAuth, (req, res) => getOrganizationNotificationsController.execute(req, res));

/*
[
    {   
        "name": "send notification",
        "path": "/notifications/send-notifications",
        "dto": "src/app/modules/notification/useCases/notifications/sendNotification/SendNotificationDTO.ts",
        "errors": "src/app/modules/notification/useCases/notifications/sendNotification/sendNotificationErrors.ts",
        "method": "POST",
        "description": "Посылает пуш уведомление."
    },
    {   
        "name": "get organization notifications",
        "path": "/notifications/get-organization-notifications/{organization}?limit={limit}&page={page}",
        "dto": "src/app/modules/notification/useCases/notifications/getOrganizationNotifications/GetOrganizationNotificationsDTO.ts",
        "errors": "src/app/modules/notification/useCases/notifications/getOrganizationNotifications/getOrganizationNotificationsErrors.ts",
        "method": "GET",
        "description": "Возвращает уведомления организации."
    }
]
*/