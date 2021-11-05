import { legalInfoRequestRepo } from "../../../repo/legalInfoRequests";
import { legalInfoRequestValidationService } from "../../../services/legalInfoRequests/legalInfoRequestValidationService";
import { createOrganizationNotificationUseCase } from "../../organizationNotifications/createOrganizationNotification";
import { RejectLegalInfoRequestController } from "./RejectLegalInfoRequestController";
import { RejectLegalInfoRequestUseCase } from "./RejectLegalInfoRequestUseCase";

export const rejectLegalInfoRequestUseCase = new RejectLegalInfoRequestUseCase(
    legalInfoRequestRepo,
    legalInfoRequestValidationService,
    createOrganizationNotificationUseCase
);

export const rejectLegalInfoRequestController = new RejectLegalInfoRequestController(
    rejectLegalInfoRequestUseCase
);