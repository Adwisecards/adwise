import { timeService } from "../../../../../services/timeService";
import { contactRepo } from "../../../../contacts/repo/contacts";
import { sendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification";
import { createOrganizationNotificationUseCase } from "../../../../organizations/useCases/organizationNotifications/createOrganizationNotification";
import { userRepo } from "../../../../users/repo/users";
import { purchaseRepo } from "../../../repo/purchases";
import { ChangePurchaseStatusesUseCase } from "./ChangePurchaseStatusesUseCase";

const changePurchaseStatusesUseCase = new ChangePurchaseStatusesUseCase(
    userRepo,
    contactRepo,
    purchaseRepo,
    sendNotificationUseCase,
    createOrganizationNotificationUseCase
);

timeService.add(changePurchaseStatusesUseCase);