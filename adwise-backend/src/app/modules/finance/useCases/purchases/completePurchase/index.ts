import { notificationService } from "../../../../../services/notificationService";
import { contactRepo } from "../../../../contacts/repo/contacts";
import { eventListenerService } from "../../../../global/services/eventListenerService";
import { sendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification";
import { userRepo } from "../../../../users/repo/users";
import { paymentRepo } from "../../../repo/payments";
import { purchaseRepo } from "../../../repo/purchases";
import { confirmPaymentUseCase } from "../../payments/confirmPayment";
import { CompletePurchaseController } from "./CompletePurchaseController";
import { CompletePurchaseUseCase } from "./CompletePurchaseUseCase";

const completePurchaseUseCase = new CompletePurchaseUseCase(
    purchaseRepo, 
    contactRepo, 
    paymentRepo, 
    userRepo,
    eventListenerService,
    sendNotificationUseCase
);

const completePurchaseController = new CompletePurchaseController(completePurchaseUseCase);

export {
    completePurchaseUseCase,
    completePurchaseController
};