import { organizationNotificationRepo } from "../../../repo/organizationNotifications";
import { organizationNotificationValidationService } from "../../../services/organizationNotifications/organizationNotificationValidationService";
import { CreateOrganizationNotificationUseCase } from "./CreateOrganizationNotificationUseCase";

export const createOrganizationNotificationUseCase = new CreateOrganizationNotificationUseCase(
    organizationNotificationRepo,
    organizationNotificationValidationService
);