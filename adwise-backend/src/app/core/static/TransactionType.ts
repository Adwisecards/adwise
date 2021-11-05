interface ITransactionType {
    [key: string]: boolean
}

/**
 * TransactionType provides static TransactionType list
 */
class TransactionType {
    private static readonly list: ITransactionType = {
        'purchase': true,
        'packet': true,
        'ref': true,
        'offer': true,
        'managerPercent': true,
        'refBackToOrganization': true,
        'adwise': true,
        'usedPoints': true,
        'deposit': true,
        'depositBack': true,
        'withdrawal': true,
        'payment': true,
        'packetRef': true,
        'correct': true,
        'correctBonus': true,
        'correctCashback': true,
        'tips': true,
        'paymentGateway': true
        // 'marketingDeposit': true
    };

    private static readonly ruTranslation = {
        purchase: 'Покупка из приложения',
        packet: 'Продажа лицензии',
        ref: 'Бонус с покупки реферала',
        offer: 'Кэшбэк',
        managerPercent: 'Процент менеджера',
        refBackToOrganization: 'Нереализованные баллы',
        adwise: 'Процент эдвайс с покупки',
        usedPoints: 'Использование баллов',
        deposit: 'Внесение депозита',
        depositBack: 'Вывод депозита',
        withdrawal: 'Вывод',
        payment: 'Оплата',
        packetRef: 'Награда реф.сети (лицензия)',
        correct: 'Корректировка баланса',
        correctBonus: 'Корректировка баланса (бонусы)',
        correctCashback: 'Корректировка баланса (кэшбэк)',
        tips: 'Чаевые',
        paymentGateway: 'Комиссия платежного шлюза'
        // marketingDeposit: 'Списание с депозита за маркетинг'
    }

    public static getList(): (keyof ITransactionType)[] {
        return Object.keys(TransactionType.list);
    }

    public static isValid(transactionType: string): boolean {
        return !!TransactionType.list[transactionType];
    }

    public static translate(type: string, lang: string): string {
        switch (lang) {
            case 'ru':
            default:
                return (<any>this.ruTranslation)[type];
        }
    }
}

export default TransactionType;