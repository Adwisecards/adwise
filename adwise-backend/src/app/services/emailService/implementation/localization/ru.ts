export default {
    'verification': {
        subject: 'Добро пожаловать в AdWise',
        body: 'Спасибо за регистрацию. Вставьте код активации в окно диалога на странице входа. Ваш код: $code',
    },
    'password': {
        subject: 'Добро пожаловать в AdWise',
        body: `Ваш пароль для входа: $password . Вы можете изменить пароль на странице профиля в личном кабинете.`,
    },
    'restoration': {
        subject: 'Восстановление пароля',
        body: `Мы получили запрос на восстановление пароля к вашему аккаунту. Вставьте код активации в окно диалога. Ваш код активации: $code`,
    },
    'packetRequest': {
        subject: 'Запрос на покупку тарифа',
        body: 'Компания $organizationName оставила запрос о покупке тарифа $packetName за $packetPrice руб. Эл. почта для связи $email'
    },
    'contact': {
        subject: 'Обратная связь',
        body: 'Пользователь оставил запрос на обратную связь. Эл. почта для связи $email'
    },
    'legalWithdrawalRequest': {
        subject: 'Запрос на вывод',
        body: 'Бизнес $name оставил запрос на вывод средств на сумму $sum руб. Эл. почты для связи: $emails , телефонные номера для связи: $phones'
    },
    'document': {
        subject: 'Документы',
        body: 'Бизнес $name отправил документы. $comment . Эл. почты для связи: $emails . телефонные номера для связи: $phones'
    },
    'enrollmentRequest': {
        subject: 'Заявка на подключение',
        body: 'Бизнес $name отправил заявку на подключение. \n \
        Комментарий: $comment. \n \
        Желаемый пакет: $packet \n \
        Менеджер: $manager \n \
        Эл. почты для связи: $emails. \n \
        Телефонные номера для связи: $phones'
    },
    'paymentTypeRequest': {
        subject: 'Заявка на смену терминала',
        body: 'Бизнес $name отправил заявку на смену терминала. Желаемый терминал: $paymentType'
    },
    'legalInfoRequest': {
        subject: 'Заявка на изменение реквизитов',
        body: 'Бизнес $name отправил заявку на изменение реквизитов. Запрос с айди $requestId'
    },
    'withdrawalAct': {
        subject: 'Ежемесячный отчет по организациям',
        body: 'Готов новый отчет по организациям за предыдущий месяц.'
    }
}