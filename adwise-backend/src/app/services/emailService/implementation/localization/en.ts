export default {
    'verification': {
        subject: 'Welcome to AdWise',
        body: 'We appreciate you\'ve joined us! Enter the following verification code into the dialog window on the registration page. Your code: $code',
    },
    'password': {
        subject: 'Welcome to AdWise',
        body: `Your password: $password. You may change it anytime on the profile setting page.`,
    },
    'restoration': {
        subject: 'Password restoration',
        body: `We've received a password restoration request. Enter the following code into the dialog window on the restoration page. Your code: $code`,
    },
    'packetRequest': {
        subject: 'Tariff purchase request',
        body: 'An organization named $organizationName has left a request to buy the $packetName tariff for $packetPrice rub. Contact email: $email'
    },
    'contact': {
        subject: 'Feedback',
        body: 'An user left a request. Contact email: $email'
    },
    'legalWithdrawalRequest': {
        subject: 'Withdrawal request',
        body: 'An organization named $name requested a withdrawal of funds in the amount of $sum rub. Contact emails: $emails. Contact numbers: $phones'
    },
    'document': {
        subject: 'Documents',
        body: 'An organization named $name has forwarded documents. $comment. Contact emails: $emails. Contact numbers: $phones'
    },
    'enrollmentRequest': {
        subject: 'Enrollment request',
        body: 'An organization with the name $name has submitted an enrollment request. \n \
        Comment: $comment. \n \
        Desired tariff: $packet \n \
        Manager: $manager \n \
        Contact emails: $emails. \n \
        Contact numbers: $phones'
    },
    'paymentTypeRequest': {
        subject: 'Terminal change request',
        body: 'An organization with the name $name requested to change its terminal. Desired terminal: $paymentType'
    },
    'legalInfoRequest': {
        subject: 'Legal information alteration request',
        body: 'An organizaion named $name submitted an request to alter its legal information. Request\'s id: $requestId'
    },
    'withdrawalAct': {
        subject: 'Ежемесячный отчет по организациям',
        body: 'Готов новый отчет по организациям за предыдущий месяц.'
    }
}