import { ITelegramService, TelegramServiceMessageType } from "../ITelegramService";
import TelegramBot from 'node-telegram-bot-api';
import { Result } from "../../../core/models/Result";

export class TelegramService implements ITelegramService {
    private readonly templates: Record<TelegramServiceMessageType, string> = {
        purchaseCreated: '\
Покупка #$purchaseCode оплачена.\n\
Сумма: $purchaseSum ₽\n\
Организация: $organizationName\n\
Покупатель: $purchaserName\n\
Тип терминала: $paymentType\n\
Сумма оплаты: $paymentSum ₽\n\
Сумма бонусов: $bonusSum ₽\n\
Время оплаты: $paymentDate',
        organizationCreated: '\
Зарегистрирована новая организация.\n\
Название: $organizationName\n\
Идентификатор: $organizationId\n\
Почта для связи: $organizationUserEmail',
        userCreated: '\
Новый пользователь зарегистрировался в системе.\n\
Имя: $userName\n\
Телефон: $userPhone\n\
Идентификатор: $userId\n\
Куратор: $parentName',
    withdrawalSatisfied: '\
Выплата организации.\n\
Организация: $organizationName\n\
Сумма выплаты: $withdrawalSum ₽\n\
Причина выплаты: $withdrawalReason\n\
Время выплаты: $withdrawalDate',
    subscriptionCreated: '\
Подписка создана.\n\
Организация: $organizationName\n\
Подписчик: $subscriber\n\
Рефер: $inviter\n\
Тип приглашения: $invitationType\n\
Уровень: $level\n\
Время подписки: $date',
    error: '\
Внутренняя ошибка при запросе.\n\
Код ошибки: $errorCode\n\
Сообщение: $errorMessage\n\
Детали ошибки: $errorDetails'
    }

    private apiKey: string;
    private chatId: string;
    private bot: TelegramBot;

    constructor(apiKey: string, chatId: string) {
        this.apiKey = apiKey;
        this.chatId = chatId;
        this.bot = new TelegramBot(this.apiKey);
    }
    
    public async send(type: TelegramServiceMessageType, values: Record<string, string>): Promise<Result<boolean | null, Error | null>> {
        try {
            const template = this.templates[type];
            if (!template) {
                throw new Error(`Type "${type}" is not valid`);
            }

            const message = this.executeTemplate(template, values);

            await this.bot.sendMessage(this.chatId, message);

            return Result.ok(true);
        } catch (ex) {
            return Result.fail(ex.message);
        }
    }

    private executeTemplate(tmpl: string, values: Record<string , string>) {
        const executedBody = tmpl.replace(/\$(\w+)/ig, (_, p1) => {
            return values[p1] || 'undefined';
        });
        return executedBody;
    }
}