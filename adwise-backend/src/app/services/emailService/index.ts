import { configProps } from "../config";
import { EmailService } from "./implementation/EmailService";

const emailService = new EmailService(configProps.mailgunDomain, configProps.mailgunKey, configProps.emailAddress, configProps.nodeEnv.toLowerCase() == 'production');

export {
    emailService
};