import { notificationService } from "../../../../../services/notificationService";
import { eventListenerService } from "../../../../global/services/eventListenerService";
import { sendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification";
import { userRepo } from "../../../../users/repo/users";
import { purchaseRepo } from "../../../repo/purchases";
import { CreatePurchaseAsUserController } from "./CreatePurchaseAsUserController";
import { CreatePurchaseAsUserUseCase } from "./CreatePurchaseAsUserUseCase";

const createPurchaseAsUserUseCase = new CreatePurchaseAsUserUseCase(userRepo, purchaseRepo, eventListenerService, sendNotificationUseCase);
const createPurchaseAsUserController = new CreatePurchaseAsUserController(createPurchaseAsUserUseCase);

export {
    createPurchaseAsUserUseCase,
    createPurchaseAsUserController
};