import { configProps } from "../config";
import { SmsService } from "./implementation/SmsService";

const smsService = new SmsService(configProps.smsruKey, configProps.nodeEnv.toLowerCase() == 'production');

export {
    smsService
};