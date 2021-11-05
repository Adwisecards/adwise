import { Logger } from "./implementation/Logger";
import { configProps } from "../config";
import * as path from 'path';

const logPath = path.join(__dirname, '..', '..', '..', '..', '.logs');
const logger = new Logger(configProps.logLevel, configProps.logTransport, logPath, configProps.bugsnagKey, configProps.databaseUrl, 'logs', 10000);

export {
    logger
};