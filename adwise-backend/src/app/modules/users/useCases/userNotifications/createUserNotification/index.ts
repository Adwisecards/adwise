import { contactRepo } from "../../../../contacts/repo/contacts";
import { purchaseRepo } from "../../../../finance/repo/purchases";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userNotificationRepo } from "../../../repo/userNotifications";
import { userRepo } from "../../../repo/users";
import { userNotificationValidationService } from "../../../services/userNotificationValidationService";
import { CreateUserNotificationUseCase } from "./CreateUserNotificationUseCase";

export const createUserNotificationUseCase = new CreateUserNotificationUseCase(
    userRepo,
    contactRepo,
    purchaseRepo,
    organizationRepo,
    userNotificationRepo,
    userNotificationValidationService
);