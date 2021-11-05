import { currencyService } from "../../../../../services/currencyService";
import { notificationService } from "../../../../../services/notificationService";
import { telegramService } from "../../../../../services/telegramService";
import { globalRepo } from "../../../../administration/repo/globals";
import { contactRepo } from "../../../../contacts/repo/contacts";
import { eventListenerService } from "../../../../global/services/eventListenerService";
import { sendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification";
import { clientRepo } from "../../../../organizations/repo/clients";
import { couponRepo } from "../../../../organizations/repo/coupons";
import { employeeRepo } from "../../../../organizations/repo/employees";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { createOrganizationNotificationUseCase } from "../../../../organizations/useCases/organizationNotifications/createOrganizationNotification";
import { getOrganizationCashierContactsUseCase } from "../../../../organizations/useCases/organizations/getOrganizationCashierContacts";
import { userRepo } from "../../../../users/repo/users";
import { createUserNotificationUseCase } from "../../../../users/useCases/userNotifications/createUserNotification";
import { paymentRepo } from "../../../repo/payments";
import { purchaseRepo } from "../../../repo/purchases";
import { walletRepo } from "../../../repo/wallets";
import { purchaseValidationService } from "../../../services/purchases/purchaseValidationService";
import { distributeToSubscriptionsUseCase } from "../../subscriptions/distributeToSubscriptions";
import { createTransactionUseCase } from "../../transactions/createTransaction";
import { disableTransactionsWithContextUseCase } from "../../transactions/disableTransactionsWithContext";
import { calculatePurchaseMarketingUseCase } from "../calculatePurchaseMarketing";
import { ConfirmPurchaseController } from "./ConfirmPurchaseController";
import { ConfirmPurchaseUseCase } from "./ConfirmPurchaseUseCase";

const confirmPurchaseUseCase = new ConfirmPurchaseUseCase(
    userRepo,
    walletRepo,
    organizationRepo,
    purchaseRepo,
    distributeToSubscriptionsUseCase,
    createTransactionUseCase,
    purchaseValidationService,
    calculatePurchaseMarketingUseCase,
    couponRepo,
    employeeRepo,
    clientRepo,
    eventListenerService,
    getOrganizationCashierContactsUseCase,
    globalRepo,
    disableTransactionsWithContextUseCase,
    sendNotificationUseCase,
    createOrganizationNotificationUseCase,
    createUserNotificationUseCase,
    telegramService,
    paymentRepo
);
const confirmPurchaseController = new ConfirmPurchaseController(confirmPurchaseUseCase);

export {
    confirmPurchaseController,
    confirmPurchaseUseCase
};