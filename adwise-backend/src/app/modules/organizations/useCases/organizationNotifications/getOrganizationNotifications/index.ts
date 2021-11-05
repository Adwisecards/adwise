import { purchaseRepo } from "../../../../finance/repo/purchases";
import { couponRepo } from "../../../repo/coupons";
import { organizationNotificationRepo } from "../../../repo/organizationNotifications";
import { organizationRepo } from "../../../repo/organizations";
import { organizationNotificationValidationService } from "../../../services/organizationNotifications/organizationNotificationValidationService";
import { GetOrganizationNotificationsController } from "./GetOrganizationNotificationsController";
import { GetOrganizationNotificationsUseCase } from "./GetOrganizationNotificationsUseCase";

export const getOrganizationNotificationsUseCase = new GetOrganizationNotificationsUseCase(
    organizationRepo,
    organizationNotificationRepo,
    organizationNotificationValidationService
);

export const getOrganizationNotificationsController = new GetOrganizationNotificationsController(getOrganizationNotificationsUseCase);