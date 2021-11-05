import { notificationService } from "../../../../../services/notificationService";
import { contactRepo } from "../../../../contacts/repo/contacts";
import { eventListenerService } from "../../../../global/services/eventListenerService";
import { sendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification";
import { userRepo } from "../../../../users/repo/users";
import { purchaseRepo } from "../../../repo/purchases";
import { purchaseValidationService } from "../../../services/purchases/purchaseValidationService";
import { SharePurchaseController } from "./SharePurchaseController";
import { SharePurchaseUseCase } from "./SharePurchaseUseCase";

export const sharePurchaseUseCase = new SharePurchaseUseCase(
    purchaseRepo, 
    contactRepo, 
    userRepo, 
    purchaseValidationService,
    eventListenerService,
    sendNotificationUseCase
);
export const sharePurchaseController = new SharePurchaseController(sharePurchaseUseCase);