import { configProps } from "../config";
import { TelegramService } from "./implementation/TelegramService";

export const telegramService = new TelegramService(configProps.telegramKey, configProps.telegramChatId);

