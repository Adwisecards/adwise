const urls = {
    "prod-host": "https://backend.adwise.cards",
    // "prod-host": "https://backend-dev.adwise.cards",
    // "prod-host": "http://14.0.0.48:5000",
    // "prod-host": "https://p.sitisit.ru",
    "web-socket": "wss://backend.adwise.cards/v1/ws/listen-user-events/",
    // "web-socket": "wss://backend-dev.adwise.cards/v1/ws/listen-user-events/",

    // accounts
    "sign-in": "/v1/accounts/users/sign-in?isCashier=1",
    "get-me": "/v1/accounts/users/me?populateEmployee=1",
    "get-me-organization": "/v1/accounts/users/me?organization=1",
    "get-user-ref": "/v1/refs/get-ref/",
    "get-user": "/v1/accounts/users/get-user/",
    "get-contact": "/v1/contacts/get-contact/",
    "update-contact": "/v1/contacts/update-contact",
    "update-user": "/v1/accounts/users/update-user",

    // purchases
    "create-purchase": "/v1/finance/create-purchase",
    "get-purchase": "/v1/finance/get-purchase/",
    "get-purchases": "/v1/organizations/get-purchases/",
    "get-user-purchases": "/v1/finance/get-user-purchases",
    "confirm-cash-payment": "/v1/finance/confirm-cash-payment/",
    "complete-purchase": "/v1/finance/complete-purchase/",
    "cashier-purchase-statistics": "/v1/finance/get-cashier-purchase-statistics",

    // organization
    "get-coupons": "/v1/organizations/get-coupons/",

    // ref
    "get-ref": "/v1/refs/get-ref/",

    "get-user-card": "/v1/accounts/users/get-user-card",
    "add-card-to-user": "/v1/accounts/users/add-card-to-user",
    "remove-card-from-user": "/v1/accounts/users/remove-card-from-user",

    // tips
    "tips-get-cashier-tips": "/v1/finance/get-cashier-tips",
    "tips-get-cashier-tips-statistics": "/v1/finance/get-cashier-tips-statistics",

    // log
    "log-create-log": "/v1/logs/create-log",

    // versions
    "versions-get-versions": "/v1/administration/get-versions?type=business",
}

export default urls
