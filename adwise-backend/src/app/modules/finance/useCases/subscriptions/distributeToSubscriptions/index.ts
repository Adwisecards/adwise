import { currencyService } from '../../../../../services/currencyService';
import { notificationService } from '../../../../../services/notificationService';
import { eventListenerService } from '../../../../global/services/eventListenerService';
import { sendNotificationUseCase } from '../../../../notification/useCases/notifications/sendNotification';
import { clientRepo } from '../../../../organizations/repo/clients';
import { couponRepo } from '../../../../organizations/repo/coupons';
import { employeeRepo } from '../../../../organizations/repo/employees';
import { organizationRepo } from '../../../../organizations/repo/organizations';
import { userRepo } from '../../../../users/repo/users';
import { purchaseRepo } from '../../../repo/purchases';
import { subscriptionRepo } from '../../../repo/subscriptions';
import { walletRepo } from '../../../repo/wallets';
import { subscriptionValidationService } from '../../../services/subscriptions/subscriptionValidationService';
import { createTransactionUseCase } from '../../transactions/createTransaction';
import {DistributeToSubscriptionsUseCase} from './DistributeToSubscriptionsUseCase';

const distributeToSubscriptionsUseCase = new DistributeToSubscriptionsUseCase(
    walletRepo,
    organizationRepo,
    couponRepo,
    createTransactionUseCase,
    employeeRepo,
    clientRepo,
    subscriptionValidationService,
    userRepo,
    eventListenerService,
    sendNotificationUseCase
);

export {
    distributeToSubscriptionsUseCase
};