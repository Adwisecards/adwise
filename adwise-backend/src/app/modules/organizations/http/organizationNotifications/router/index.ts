import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { getOrganizationNotificationsController } from "../../../useCases/organizationNotifications/getOrganizationNotifications";
import { getUnseenOrganizationNotificationCountController } from "../../../useCases/organizationNotifications/getUnseenOrganizationNotificationCount";

export const organizationNotificationRouter = Router();

organizationNotificationRouter.get('/get-organization-notifications/:id', applyBlock, applyAuth, (req, res) => getOrganizationNotificationsController.execute(req, res));
organizationNotificationRouter.get('/get-unseen-organization-notification-count/:id', applyBlock, applyAuth, (req, res) => getUnseenOrganizationNotificationCountController.execute(req, res));

/*
[
    {
        "name": "get organization notifications",
        "path": "/organizations/get-organization-notifications/{organizationId}?limit={limit}&page={page}&seen={1}",
        "dto": "src/app/modules/organizations/useCases/organizationNotifications/getOrganizationNotifications/GetOrganizationNotificationsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizationNotifications/getOrganizationNotifications/getOrganizationNotificationsErrors.ts",
        "method": "GET",
        "description": "Возвращает уведомления организации."
    },
    {
        "name": "get unseen organization notification count",
        "path": "/organizations/get-unseen-organization-notification-count/{organizationId}",
        "dto": "src/app/modules/organizations/useCases/organizationNotifications/getUnseenOrganizationNotificationCount/GetUnseenOrganizationNotificationCountDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizationNotifications/getUnseenOrganizationNotificationCount/getUnseenOrganizationNotificationCountErrors.ts",
        "method": "GET",
        "description": "Возвращает кол-во уведомления организации."
    }
]
*/