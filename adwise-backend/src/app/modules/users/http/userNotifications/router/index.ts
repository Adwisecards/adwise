import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { getUnseenUserNotificationCountController } from "../../../useCases/userNotifications/getUnseenUserNotificationCount";
import { getUserNotificationsController } from "../../../useCases/userNotifications/getUserNotifications";

export const userNotificationRouter = Router();

userNotificationRouter.get('/get-user-notifications', applyBlock, applyAuth, (req, res) => getUserNotificationsController.execute(req, res));
userNotificationRouter.get('/get-unseen-user-notification-count', applyBlock, applyAuth, (req, res) => getUnseenUserNotificationCountController.execute(req, res));

/*
    {
        "name": "get user notifications",
        "path": "/accounts/users/get-user-notifications?limit={limit}&page={page}&seen={1}",
        "dto": "src/app/modules/users/useCases/userNotifications/getUserNotifications/GetUserNotificationsDTO.ts",
        "errors": "src/app/modules/users/useCases/userNotifications/getUserNotifications/getUserNotificationsErrors.ts",
        "method": "GET",
        "description": "Возвращает уведомления пользователя."
    },
    {
        "name": "get unseen user notification count",
        "path": "/accounts/users/get-unseen-user-notification-count",
        "dto": "src/app/modules/users/useCases/userNotifications/getUnseenUserNotificationCount/GetUnseenUserNotificationCountDTO.ts",
        "errors": "src/app/modules/users/useCases/userNotifications/getUnseenUserNotificationsCount/getUnseenUserNotificationsCountErrors.ts",
        "method": "GET",
        "description": "Возвращает кол-во непрочитанных уведомлений пользователя."
    }
*/