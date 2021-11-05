import { notificationService } from "../../../../../services/notificationService";
import { eventListenerService } from "../../../../global/services/eventListenerService";
import { sendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification";
import { createInvitationUseCase } from "../../../../organizations/useCases/invitations/createInvitation";
import { subscribeToOrganizationUseCase } from "../../../../organizations/useCases/organizations/subscribeToOrganization";
import { userRepo } from "../../../../users/repo/users";
import { createUserNotificationUseCase } from "../../../../users/useCases/userNotifications/createUserNotification";
import { contactRepo } from "../../../repo/contacts";
import { requestRepo } from "../../../repo/requests";
import { AcceptRequestController } from "./AcceptRequestController";
import { AcceptRequestUseCase } from "./AcceptRequestUseCase";

const acceptRequestUseCase = new AcceptRequestUseCase(
    requestRepo, 
    userRepo, 
    contactRepo, 
    subscribeToOrganizationUseCase, 
    createInvitationUseCase, 
    eventListenerService,
    sendNotificationUseCase,
    createUserNotificationUseCase
);
const acceptRequestController = new AcceptRequestController(acceptRequestUseCase);

export {
    acceptRequestController,
    acceptRequestUseCase
};