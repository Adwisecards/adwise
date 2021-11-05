import { Result } from '../../../core/models/Result';
import { App, INotificationService, IPushMessage, NotificationServiceLocalization } from '../INotificationService';
import { Expo } from 'expo-server-sdk';
import jwt from 'jsonwebtoken';
import http2 from 'http2';
import en from './localization/en';
import ru from './localization/ru';

export class NotificationService implements INotificationService {
    private kidCardsApp: string;
    private kidBusinessApp: string;
    private apnsTopicCardsApp: string;
    private apnsTopicBusinessApp: string;
    private expo: Expo;
    private iss: string;
    private apnsUrl: string;
    private authKey: string;
    private isProd: boolean;

    constructor(
        kidCardsApp: string,
        kidBusinessApp: string,
        apnsTopicCardsApp: string,
        apnsTopicBusinessApp: string,
        iss: string,
        apnsUrl: string,
        authKey: string,
        isProd: boolean
    ) {
        this.kidCardsApp = kidCardsApp;
        this.kidBusinessApp = kidBusinessApp;
        this.apnsTopicCardsApp = apnsTopicCardsApp;
        this.apnsTopicBusinessApp = apnsTopicBusinessApp;
        this.expo = new Expo();
        this.iss = iss;
        this.apnsUrl = apnsUrl;
        this.authKey = authKey;
        this.isProd = isProd;

        console.log('this.kidCardsApp', this.kidCardsApp);
        console.log('this.kidBusinessApp', this.kidBusinessApp);
        console.log('this.apnsTopicCardsApp', this.apnsTopicCardsApp);
        console.log('this.apnsTopicBusinessApp', this.apnsTopicBusinessApp);
    }

    private notifications = {
        en: {
            ...en,
            'common': {
                title: '',
                body: '',
                data: {}
            }
        },
        ru: {
            ...ru,
            'common': {
                title: '',
                body: '',
                data: {}
            }
        }
    };

    public async sendNotification(app: App, pushToken: string, deviceToken: string, type: string, values: any, data: object, notification?: IPushMessage, localization?: NotificationServiceLocalization): Promise<Result<IPushMessage | null, Error | null>> {        
        console.log('\n\n', 123123123123123, '\n\n')
        if (!this.isProd) {
            console.log(pushToken, deviceToken);
            return Result.fail(new Error('Environment is not production'));
        }

        localization = localization || 'ru'
        
        try {
            let message: IPushMessage;

            if (pushToken) {
                const notificationSent = await this.sendAndroidNotification(pushToken, type, values, data, notification, localization);
                if (notificationSent.isFailure) {
                    throw notificationSent.getError()!;
                }

                message = notificationSent.getValue()!;
            }

            if (deviceToken) {
                const notificationSent = await this.sendIosNotification(app, deviceToken, type, values, data, notification, localization);
                if (notificationSent.isFailure) {
                    throw notificationSent.getError()!;
                }

                message = notificationSent.getValue()!;
            }

            return Result.ok(message!);
        } catch (ex) {
            console.log('NOTIFICATION: EX', ex);
            return Result.fail(ex);
        }
    }

    private async sendIosNotification(app: App, to: string, type: string, values: any, data: object, notification?: IPushMessage, localization?: NotificationServiceLocalization): Promise<Result<IPushMessage | null, Error | null>> {
        try {
            let message: IPushMessage;

            if (type == 'common' && notification) {
                message = {
                    body: notification.body,
                    data: {
                        ...notification.data,
                        type: type || 'common'
                    },
                    title: notification.title
                };
            } else {
                message = {
                    body: this.executeTemplate((<any>this.notifications)[localization!][type].body, values),
                    data: {
                        ...(<any>this.notifications)[type].data,
                        data
                    },
                    title: (<any>this.notifications)[localization!][type].title
                };
            }

            console.log('IOS NOTIFICATION: MESSAGE', message);

            const token = jwt.sign(
                {
                    iss: this.iss,
                    iat: Math.round(new Date().getTime() / 1000)
                },
                this.authKey,
                {
                    header: {
                        alg: 'ES256',
                        kid: this.kidCardsApp
                    }
                }
            );

            console.log('IOS NOTIFICATION: TOKEN', token);

            const client = http2.connect(this.apnsUrl);

            const headers = {
                ':method': 'POST',
                ':scheme': 'https',
                'apns-topic': app == 'cards' ? this.apnsTopicCardsApp : this.apnsTopicBusinessApp,
                ':path': '/3/device/' + to,
                'authorization': 'bearer ' + token
            };

            console.log('IOS NOTIFICATION: HEADERS', headers);

            return new Promise(resolve => {
                const request = client.request(headers);

                request.setEncoding('utf8');

                const data = {
                    aps: {
                        alert: {
                            title: message.title,
                            body: message.body
                        }
                    },
                    data: {
                        ...message.data
                    }
                };

                console.log('IOS NOTIFICATION: DATA', data);

                request.write(JSON.stringify(data));

                // TEMP
                request.on('response', (headers, flags) => {
                    console.log(headers);
                    console.log(flags);
                });

                const responseRowData: Buffer[] = [];

                request.on('data', (chunk: Buffer) => {
                    console.log('IOS NOTIFICATION: CHUNK', chunk);
                    responseRowData.push(chunk);
                });

                let responseData = '';
                request.on('end', () => {
                    responseData = Buffer.concat(responseRowData).toString();
                    console.log('IOS NOTIFICATION: RESPONSE DATA', responseData);

                    return resolve(Result.ok(message));
                });

                return resolve(Result.ok(undefined as any));
            });

        } catch (ex) {
            console.log(ex);
            return Result.fail(ex);
        }
    }

    private async sendAndroidNotification(to: string, type: string, values: any, data: object, notification?: IPushMessage, localization?: NotificationServiceLocalization): Promise<Result<IPushMessage | null, Error | null>> {
        try {
            console.log('ANDROID NOTIFICATION: START')
            let message: IPushMessage;

            if (type == 'common' && notification) {
                message = {
                    body: notification.body,
                    data: {
                        ...notification.data,
                        type: type || 'common'
                    },
                    title: notification.title,
                    to: to,
                    channelId: '1'
                };
            } else {
                message = {
                    body: this.executeTemplate((<any>this.notifications)[type].body, values),
                    data: {
                        ...(<any>this.notifications)[localization!][type].data,
                        data
                    },
                    title: (<any>this.notifications)[localization!][type].title,
                    to: to,
                    channelId: '1'
                };
            } 

            const tickets = await this.expo.sendPushNotificationsAsync([message as any]);
            console.log('ANDROID NOTIFICATION: TICKETS', tickets)

            for (const ticket of tickets) {
                if (ticket.status == 'error') {
                    console.log('ANDROID NOTIFICATION: ERROR', ticket.message);
                    return Result.fail(new Error(ticket.message));
                }
            }

            return Result.ok(message);
        } catch (ex) {
            console.log('ANDROID NOTIFICATION: EX', ex);
            return Result.fail(ex);
        }
    }

    private executeTemplate(body: string, data: any) {
        const executedBody = body.replace(/\$(\w+)/ig, (_, p1) => {
            return data[p1] || 'undefined';
        });
        return executedBody;
    }
}