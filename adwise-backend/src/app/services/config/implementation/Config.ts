import { IConfig, IConfigProps } from "../IConfig";
import * as dotenv from 'dotenv';

export class Config implements IConfig {
    public path: string;
    constructor(path: string) {
        this.path = path;
    }

    load(): IConfigProps {
        dotenv.config({ path: this.path });

        const configProps: IConfigProps = {
            appSecret: process.env.APP_SECRET || 'topSecret',
            databaseUrl: process.env.DATABASE_URL || '',
            nodeEnv: process.env.NODE_ENV || 'production',
            port: Number.parseInt(process.env.PORT as string) || 3000,
            maxUploadLimit: process.env.APP_MAX_UPLOAD_LIMIT || '50mb',
            maxParameterLimit: process.env.APP_MAX_PARAMETER_LIMIT || '100',
            logLevel: process.env.LOG_LEVEL || 'http',
            logTransport: process.env.LOG_TRANSPORT || 'console',
            saltWorkFactor: Number.parseInt(process.env.SALT_WORK_FACTOR as string) || 10,
            jwtExpriresIn: process.env.JWT_EXPIRES_IN || '5 min',
            frontendUrl: process.env.FRONTEND_URL || '',
            backendUrl: process.env.BACKEND_URL || '',
            expoToken: process.env.EXPO_TOKEN || '',
            googleMapsToken: process.env.GOOGLE_MAPS_KEY || '',
            mailgunDomain: process.env.MAILGUN_DOMAIN || '',
            mailgunKey: process.env.MAILGUN_KEY || '',
            smsruKey: process.env.SMSRU_KEY || '',
            iss: process.env.ISS || '',
            apnsUrl: process.env.APNS_URL || '',
            wisewinUrl: process.env.WISEWIN_URL || '',
            curconvKey: process.env.CURCONV_KEY || '',
            curconvUrl: process.env.CURCONV_URL || '',
            timeServiceInterval: Number.parseInt(process.env.TIME_SERVICE_INTERVAL as string) || 60000,
            storageBucketName: process.env.STORAGE_BUCKET_NAME || '',
            storageBucketUrl: process.env.STORAGE_BUCKET_BASE_URL || '',
            storageBucketFolder: process.env.STORAGE_BUCKET_FOLDER || '',
            bugsnagKey: process.env.BUGSNAG_KEY || '',
            yandexKassaKey: process.env.YANDEX_KASSA_KEY || '',
            yandexKassaShopId: process.env.YANDEX_KASSA_SHOP_ID || '',
            emailAddress: process.env.EMAIL_ADDRESS || '',
            tinkoffKeyDefault: process.env.TINKOFF_KEY_DEFAULT || '',
            tinkoffPasswordDefault: process.env.TINKOFF_PASSWORD_DEFAULT || '',
            tinkoffKeySplit: process.env.TINKOFF_KEY_SPLIT || '',
            tinkoffPasswordSplit: process.env.TINKOFF_PASSWORD_SPLIT || '',
            tinkoffKeySafeETC: process.env.TINKOFF_KEY_SAFE_ETC || '',
            tinkoffKeySafe: process.env.TINKOFF_KEY_SAFE || '',
            tinkoffPasswordSafe: process.env.TINKOFF_PASSWORD_SAFE || '',
            tinkoffUserName: process.env.TINKOFF_USERNAME || '',
            tinkoffUserPassword: process.env.TINKOFF_USERPASSWORD || '',
            tinkoffSplitUrl: process.env.TINKOFF_SPLIT_URL || '',
            tinkoffDefaultUrl: process.env.TINKOFF_DEFAULT_URL || '',
            tinkoffRegistrationUrl: process.env.TINKOFF_REGISTRATION_URL || '',
            tinkoffEtcUrl: process.env.TINKOFF_ETC_URL || '',
            tinkoffSafeUrl: process.env.TINKOFF_SAFE_URL || '',
            legalEmail: process.env.LEGAL_EMAIL || '',
            cryptoUrl: process.env.CRYPTO_URL || '',
            coincupUrl: process.env.COINCAP_URL || '',
            signKey: process.env.SIGN_KEY || '',
            signUrl: process.env.SIGN_URL || '',
            mode: process.env.MODE || 'httpserver-timeservice',
            accessKey: process.env.ACCESS_KEY || '',
            daDataKey: process.env.DADATA_KEY || '',
            daDataSecretKey: process.env.DADATA_SECRET_KEY || '',
            cluster: process.env.CLUSTER == "true" ? true : false,
            demo: process.env.DEMO == "true" ? true : false,
            kidCardsApp: process.env.KID_CARDS_APP || '',
            kidBusinessApp: process.env.KID_BUSINESS_APP || '',
            apnsTopicCardsApp: process.env.APNS_TOPIC_CARDS_APP || '',
            apnsTopicBusinessApp: process.env.APNS_TOPIC_BUSINESS_APP || '',
            telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
            telegramKey: process.env.TELEGRAM_KEY || ''
        };

        return configProps;
    }
}