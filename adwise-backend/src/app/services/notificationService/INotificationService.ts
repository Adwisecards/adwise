import { Result } from "../../core/models/Result";

export type NotificationType = 'contactRequestCreated' | 'contactRequestAccepted' | 'taskCreated' | 'purchaseCreated' |
                               'purchaseConfirmed' | 'refPurchase' | 'purchaseCompleted' | 'purchaseShared' | 'common' |
                               'purchaseConfirmedBusiness' | 'employeeCreated' | 'purchaseIncomplete';

                               
export interface IPushMessage {
    to?: string;
    title: string;
    body: string;
    data: object;
    channelId?: string;
};

export type App = 'cards' | 'business';

export type NotificationServiceLocalization = 'en' | 'ru';

export interface INotificationService {
    sendNotification(app: App, pushToken: string, deviceToken: string, type: string, values: any, data: object, notification?: IPushMessage, localization?: NotificationServiceLocalization): Promise<Result<IPushMessage | null, Error | null>>;
};