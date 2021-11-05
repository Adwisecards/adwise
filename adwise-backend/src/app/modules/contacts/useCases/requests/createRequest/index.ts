import { notificationService } from "../../../../../services/notificationService";
import { sendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification";
import { userRepo } from "../../../../users/repo/users";
import { contactRepo } from "../../../repo/contacts";
import { requestRepo } from "../../../repo/requests";
import { acceptRequestUseCase } from "../acceptRequest";
import { CreateRequestController } from "./CreateRequestController";
import { CreateRequestUseCase } from "./CreateRequestUseCase";

const createRequestUseCase = new CreateRequestUseCase(requestRepo, userRepo, contactRepo, acceptRequestUseCase, sendNotificationUseCase);
const createRequestController = new CreateRequestController(createRequestUseCase);

export {
    createRequestUseCase,
    createRequestController
};