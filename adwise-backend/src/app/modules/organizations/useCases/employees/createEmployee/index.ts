import { contactRepo } from "../../../../contacts/repo/contacts";
import { walletRepo } from "../../../../finance/repo/wallets";
import { sendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification";
import { createRefUseCase } from "../../../../ref/useCases/createRef";
import { userRepo } from "../../../../users/repo/users";
import { createUserNotificationUseCase } from "../../../../users/useCases/userNotifications/createUserNotification";
import { employeeRepo } from "../../../repo/employees";
import { organizationRepo } from "../../../repo/organizations";
import { CreateEmployeeController } from "./CreateEmployeeController";
import { CreateEmployeeUseCase } from "./CreateEmployeeUseCase";

const createEmployeeUseCase = new CreateEmployeeUseCase(
    contactRepo, 
    organizationRepo, 
    employeeRepo, 
    userRepo, 
    createRefUseCase, 
    walletRepo,
    createUserNotificationUseCase,
    sendNotificationUseCase
);

const createEmployeeController = new CreateEmployeeController(createEmployeeUseCase);

export {
    createEmployeeController,
    createEmployeeUseCase
};