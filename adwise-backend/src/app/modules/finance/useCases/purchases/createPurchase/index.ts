import { notificationService } from "../../../../../services/notificationService";
import { globalRepo } from "../../../../administration/repo/globals";
import { contactRepo } from "../../../../contacts/repo/contacts";
import { eventListenerService } from "../../../../global/services/eventListenerService";
import { sendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification";
import { clientRepo } from "../../../../organizations/repo/clients";
import { couponRepo } from "../../../../organizations/repo/coupons";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { createRefUseCase } from "../../../../ref/useCases/createRef";
import { userRepo } from "../../../../users/repo/users";
import { createUserNotificationUseCase } from "../../../../users/useCases/userNotifications/createUserNotification";
import { offerRepo } from "../../../repo/offers";
import { purchaseRepo } from "../../../repo/purchases";
import { walletRepo } from "../../../repo/wallets";
import { purchaseValidationService } from "../../../services/purchases/purchaseValidationService";
import { calculatePurchaseMarketingUseCase } from "../calculatePurchaseMarketing";
import { CreatePurchaseController } from "./CreatePurchaseController";
import { CreatePurchaseUseCase } from "./CreatePurchaseUseCase";

const createPurchaseUseCase = new CreatePurchaseUseCase(
    purchaseRepo, 
    contactRepo, 
    organizationRepo, 
    couponRepo, 
    offerRepo, 
    purchaseValidationService, 
    userRepo, 
    createRefUseCase, 
    eventListenerService,
    globalRepo,
    walletRepo,
    sendNotificationUseCase,
    clientRepo,
    calculatePurchaseMarketingUseCase,
    createUserNotificationUseCase
);
const createPurchaseController = new CreatePurchaseController(createPurchaseUseCase);

export {
    createPurchaseUseCase,
    createPurchaseController
};