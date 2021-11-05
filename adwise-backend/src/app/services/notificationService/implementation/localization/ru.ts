export default {
    'contactRequestCreated': {
        title: 'Запрос на обмен визитками',
        body: '$name хочет обменяться визитками с вами',
        data: {
            type: 'contactRequestCreated'
        }
    },
    'contactRequestAccepted': {
        title: 'С вами обменялись визитками',
        body: '$name теперь в ваших контактах',
        data: {
            type: 'contactRequestAccepted'
        }
    },
    'taskCreated': {
        title: 'Вы стали участником задачи',
        body: 'Вас добавили к задаче $taskName как участника',
        data: {
            type: 'taskCreated'
        }
    },
    'purchaseCreated': {
        title: 'У вас появилась неоплаченная покупка',
        body: 'У вас есть неоплаченная покупка на сумму $sumInPoints рублей',
        data: {
            type: 'purchaseCreated'
        }
    },
    'purchaseConfirmed': {
        title: 'Покупка оплачена',
        body: 'Вы оплатили новую покупку на сумму $sumInPoints рублей',
        data: {
            type: 'purchaseConfirmed'
        }
    },
    'purchaseConfirmedBusiness': {
        title: 'Покупка оплачена',
        body: 'Покупка № $purchaseCode на сумму $sumInPoints рублей оплачена',
        data: {
            type: 'purchaseConfirmedBusiness'
        }
    },
    'refPurchase': {
        title: 'Ваш реферал совершил покупку',
        body: 'Человек, которого вы пригласили, совершил покупку. Вам начисленно $points рублей',
        data: {
            type: 'refPurchase'
        }
    },
    'purchaseCompleted': {
        title: 'Покупка завершена продавцом',
        body: 'Продавец завершил покупку, которую вы оплатили',
        data: {
            type: 'purchaseCompleted'
        }
    },
    'purchaseShared': {
        title: 'С вами поделились покупкой',
        body: 'Пользователь $sharingUserName поделился с вами покупкой',
        data: {
            type: 'purchaseShared'
        }
    },
    'employeeCreated': {
        title: 'Вас назначили кассиром',
        body: 'Организация $organizationName назначила вас кассиром',
        data: {
            type: 'employeeCreated'
        }
    },
    'purchaseIncomplete': {
        title: 'Незавершенная покупка',
        body: 'У вас есть незавершенная покупка #$purchaseCode',
        data: {
            type: 'purchaseIncomplete'
        }
    }
};