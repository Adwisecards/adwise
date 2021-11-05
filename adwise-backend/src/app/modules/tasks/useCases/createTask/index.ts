import { notificationService } from "../../../../services/notificationService";
import { contactRepo } from "../../../contacts/repo/contacts";
import { sendNotificationUseCase } from "../../../notification/useCases/notifications/sendNotification";
import { userRepo } from "../../../users/repo/users";
import { taskRepo } from "../../repo";
import { taskValidationService } from "../../services/taskValidationService";
import { CreateTaskController } from "./CreateTaskController";
import { CreateTaskUseCase } from "./CreateTaskUseCase";

const createTaskUseCase = new CreateTaskUseCase(taskRepo, taskValidationService, contactRepo, userRepo, sendNotificationUseCase);
const createTaskController = new CreateTaskController(createTaskUseCase);

export {
    createTaskUseCase,
    createTaskController
};