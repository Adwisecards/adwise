import { Router } from "express";
import WebSocket from "ws";
import { administrationRouter } from "../../../../modules/administration/http/router";
import { contactRouter } from "../../../../modules/contacts/http/contacts/router";
import { refRouter } from "../../../../modules/ref/http/router";
import { requestRouter } from "../../../../modules/contacts/http/requests/router";
import { bankRequestRouter } from "../../../../modules/finance/http/bankRequests/router";
import { paymentRouter } from "../../../../modules/finance/http/payments/router";
import { purchaseRouter } from "../../../../modules/finance/http/purchases/router";
import { subscriptionRouter } from "../../../../modules/finance/http/subscriptions/router";
import { tipsRouter } from "../../../../modules/finance/http/tips/router";
import { transactionRouter } from "../../../../modules/finance/http/transactions/router";
import { walletRouter } from "../../../../modules/finance/http/wallets/router";
import { withdrawalRequestRouter } from "../../../../modules/finance/http/withdrawalRequests/router";
import { globalRouter } from "../../../../modules/global/http/router";
import { globalWsRouter } from "../../../../modules/global/ws/router";
import { categoryRouter } from "../../../../modules/organizations/http/categories/router";
import { couponRouter } from "../../../../modules/organizations/http/coupons/router";
import { employeeRatingRouter } from "../../../../modules/organizations/http/employeeRatings/router";
import { employeeRouter } from "../../../../modules/organizations/http/employees/router";
import { favoriteCouponListRouter } from "../../../../modules/organizations/http/favoriteCouponLists/router";
import { hiddenCouponListRouter } from "../../../../modules/organizations/http/hiddenCouponLists/router";
import { invitationRouter } from "../../../../modules/organizations/http/invitations/router";
import { organizationRouter } from "../../../../modules/organizations/http/organizations/router";
import { organizationStatisticsRouter } from "../../../../modules/organizations/http/organizationStatistics/router";
import { packetRouter } from "../../../../modules/organizations/http/packets/router";
import { productRouter } from "../../../../modules/organizations/http/products/router";
import { taskRouter } from "../../../../modules/tasks/http/router";
import { restorationRouter } from "../../../../modules/users/http/restorations/router";
import { userRouter } from "../../../../modules/users/http/users/router";
import { verificationRouter } from "../../../../modules/users/http/verifications/router";
import { offerRouter } from "../../../../modules/finance/http/offers/router";
import { accumulationRouter } from "../../../../modules/finance/http/accumulation/router";
import { notificationRouter } from "../../../../modules/notification/http/notifications/router";
import { receiverGroupRouter } from "../../../../modules/notification/http/receiverGroups/router";
import { logRouter } from "../../../../modules/logs/http/router";
import { notificationSettingsRouter } from "../../../../modules/notification/http/notificationSettings/router";
import { organizationNotificationRouter } from "../../../../modules/organizations/http/organizationNotifications/router";
import { legalInfoRequestRouter } from "../../../../modules/organizations/http/legalInfoRequests/router";
import { favoriteOrganizationListRouter } from "../../../../modules/organizations/http/favoriteOrganizationLists/router";
import { chatRouter } from "../../../../modules/messages/http/chats/router";
import { messageRouter } from "../../../../modules/messages/http/messages/router";
import { mediaRouter } from "../../../../modules/media/http/router";
import { addressRouter } from "../../../../modules/maps/http/addresses/router";
import { couponCategoryRouter } from "../../../../modules/organizations/http/couponCategories/router";
import { organizationDocumentRouter } from "../../../../modules/legal/http/organizationDocuments/router";
import { couponDocumentRouter } from "../../../../modules/legal/http/couponDocuments/router";
import { userNotificationRouter } from "../../../../modules/users/http/userNotifications/router";
import { userDocumentRouter } from "../../../../modules/legal/http/userDocuments/router";
import { legalRouter } from "../../../../modules/legal/http/legal/router";

const v1Router = () => {
    const router = Router();

    const accountRouter = Router();

    accountRouter.use('/users', userRouter);
    accountRouter.use('/verifications', verificationRouter);
    accountRouter.use('/restorations', restorationRouter);
    accountRouter.use('/user-notifications', userNotificationRouter);

    const mainContactRouter = Router();
    mainContactRouter.use(contactRouter);
    mainContactRouter.use(requestRouter);

    const mainOrganizationRouter = Router();
    mainOrganizationRouter.use(organizationRouter);
    mainOrganizationRouter.use(categoryRouter);
    mainOrganizationRouter.use(invitationRouter);
    mainOrganizationRouter.use(couponRouter);
    mainOrganizationRouter.use(employeeRouter);
    mainOrganizationRouter.use(productRouter);
    mainOrganizationRouter.use(packetRouter);
    mainOrganizationRouter.use(employeeRatingRouter);
    mainOrganizationRouter.use(favoriteCouponListRouter);
    mainOrganizationRouter.use(hiddenCouponListRouter);
    mainOrganizationRouter.use(organizationStatisticsRouter);
    mainOrganizationRouter.use(organizationNotificationRouter);
    mainOrganizationRouter.use(legalInfoRequestRouter);
    mainOrganizationRouter.use(favoriteOrganizationListRouter);
    mainOrganizationRouter.use(couponCategoryRouter);

    const mainFinanceRouter = Router();
    mainFinanceRouter.use(purchaseRouter);
    mainFinanceRouter.use(walletRouter);
    mainFinanceRouter.use(paymentRouter);
    mainFinanceRouter.use(subscriptionRouter);
    mainFinanceRouter.use(withdrawalRequestRouter);
    mainFinanceRouter.use(transactionRouter);
    mainFinanceRouter.use(tipsRouter);
    mainFinanceRouter.use(bankRequestRouter);
    mainFinanceRouter.use(offerRouter);
    mainFinanceRouter.use(accumulationRouter);

    const mainNotificationRouter = Router();
    mainNotificationRouter.use(notificationRouter);
    mainNotificationRouter.use(receiverGroupRouter);
    mainNotificationRouter.use(notificationSettingsRouter);

    const mainMessageRouter = Router();
    mainMessageRouter.use(chatRouter);
    mainMessageRouter.use(messageRouter);

    const mainMapsRouter = Router();
    mainMapsRouter.use(addressRouter);

    const mainLegalRouter = Router();
    mainLegalRouter.use(organizationDocumentRouter);
    mainLegalRouter.use(couponDocumentRouter);
    mainLegalRouter.use(userDocumentRouter);
    mainLegalRouter.use(legalRouter);

    router.use('/accounts', accountRouter);
    router.use('/contacts', mainContactRouter);
    router.use('/organizations', mainOrganizationRouter);
    router.use('/tasks', taskRouter);
    router.use('/finance', mainFinanceRouter);
    router.use('/refs', refRouter);
    router.use('/global', globalRouter);
    router.use('/ws', globalWsRouter());
    router.use('/administration', administrationRouter);
    router.use('/notifications', mainNotificationRouter);
    router.use('/logs', logRouter);
    router.use('/messages', mainMessageRouter);
    router.use('/media', mediaRouter);
    router.use('/maps', mainMapsRouter);
    router.use('/legal', mainLegalRouter);

    return router;
};

export {
    v1Router
};