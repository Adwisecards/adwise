import { NotificationService } from "./implementation/NotificationService";
import fs from 'fs';
import path from 'path';
import { configProps } from "../config";

const filepath = path.join(__dirname, 'implementation', 'certs', 'AuthKey_T5PK484RLY.p8');

const authKey = fs.readFileSync(filepath, {encoding: 'utf8'});

const notificationService = new NotificationService(
    configProps.kidCardsApp,
    configProps.kidBusinessApp,
    configProps.apnsTopicCardsApp,
    configProps.apnsTopicBusinessApp,
    configProps.iss,
    configProps.apnsUrl,
    authKey,
    configProps.nodeEnv.toLowerCase() == 'production'
);

export {
    notificationService
};