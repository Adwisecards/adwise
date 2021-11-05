import { Result } from "../../core/models/Result";

export type TelegramServiceMessageType = 'purchaseCreated' | 'organizationCreated' | 'userCreated' | 'withdrawalSatisfied' | 'subscriptionCreated' | 'error';

export interface ITelegramService {
    send(type: TelegramServiceMessageType, values: Record<string, string>): Promise<Result<boolean | null, Error | null>>;
};