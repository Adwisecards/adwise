import { organizationNotificationRepo } from "../../../repo/organizationNotifications";
import { organizationRepo } from "../../../repo/organizations";
import { organizationNotificationValidationService } from "../../../services/organizationNotifications/organizationNotificationValidationService";
import { GetUnseenOrganizationNotificationCountController } from "./GetUnseenOrganizationNotificationCountController";
import { GetUnseenOrganizationNotificationCountUseCase } from "./GetUnseenOrganizationNotificationCountUseCase";

export const getUnseenOrganizationNotificationCountUseCase = new GetUnseenOrganizationNotificationCountUseCase(
    organizationRepo,
    organizationNotificationRepo,
    organizationNotificationValidationService
);

export const getUnseenOrganizationNotificationCountController = new GetUnseenOrganizationNotificationCountController(
    getUnseenOrganizationNotificationCountUseCase
);