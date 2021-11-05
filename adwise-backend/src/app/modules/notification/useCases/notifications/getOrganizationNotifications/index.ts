import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { notificationRepo } from "../../../repo/notifications";
import { notificationValidationService } from "../../../services/notifications/notificationValidationService";
import { GetOrganizationNotificationsController } from "./GetOrganizationNotificationsController";
import { GetOrganizationNotificationsUseCase } from "./GetOrganizationNotificationsUseCase";

export const getOrganizationNotificationsUseCase = new GetOrganizationNotificationsUseCase(
    userRepo,
    notificationRepo,
    organizationRepo,
    notificationValidationService
);

export const getOrganizationNotificationsController = new GetOrganizationNotificationsController(getOrganizationNotificationsUseCase);