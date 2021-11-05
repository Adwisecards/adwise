export interface IConfigProps {
    nodeEnv: string;
    appSecret: string;
    databaseUrl: string;
    port: number;
    maxUploadLimit: string;
    maxParameterLimit: string;
    logTransport: string;
    logLevel: string;
    saltWorkFactor: number;
    jwtExpriresIn: string;
    frontendUrl: string;
    backendUrl: string;
    expoToken: string;
    googleMapsToken: string;
    mailgunKey: string;
    mailgunDomain: string;
    smsruKey: string;
    iss: string;
    kidCardsApp: string;
    apnsTopicCardsApp: string;
    kidBusinessApp: string;
    apnsTopicBusinessApp: string;
    apnsUrl: string;
    wisewinUrl: string;
    curconvUrl: string;
    curconvKey: string;
    timeServiceInterval: number;
    storageBucketName: string;
    storageBucketUrl: string;
    storageBucketFolder: string;
    bugsnagKey: string;
    yandexKassaKey: string;
    yandexKassaShopId: string;
    emailAddress: string;
    tinkoffKeyDefault: string;
    tinkoffPasswordDefault: string;
    tinkoffKeySplit: string;
    tinkoffPasswordSplit: string;
    tinkoffKeySafeETC: string;
    tinkoffKeySafe: string;
    tinkoffPasswordSafe: string;
    tinkoffUserName: string;
    tinkoffUserPassword: string;
    tinkoffRegistrationUrl: string;
    tinkoffEtcUrl: string;
    tinkoffDefaultUrl: string;
    tinkoffSplitUrl: string;
    tinkoffSafeUrl: string;
    legalEmail: string;
    cryptoUrl: string;
    coincupUrl: string;
    signUrl: string;
    signKey: string;
    mode: string;
    accessKey: string;
    daDataKey: string;
    daDataSecretKey: string;
    telegramKey: string,
    telegramChatId: string,
    cluster: boolean;
    demo: boolean;
};

export interface IConfig {
    path: string;
    load(): IConfigProps;
};