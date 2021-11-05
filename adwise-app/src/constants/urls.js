const urls = {
    "prod-host": "https://backend.adwise.cards",
    // "prod-host": "https://backend-dev.adwise.cards",
    // "prod-host": "http://14.0.0.48:5000",
    // "prod-host": "https://adwise-backend-test.wise.win",
    // "prod-host": "https://p.sitisit.ru",
    "web-site": "https://adwise.cards",
    "dev-host": "",
    "web-socket": "wss://backend.adwise.cards/v1/ws/listen-user-events/",
    // "web-socket": "ws://14.0.0.48:5000/v1/ws/listen-user-events/",
    "url-page-withdrawal-funds": "https://wise.win/adpay",

    //users
    "create-user": "/v1/accounts/users/create-user",
    "sign-in": "/v1/accounts/users/sign-in?isApp=1",
    "get-me": "/v1/accounts/users/me",
    "set-user-language": "/v1/accounts/users/set-user-language",
    "update-user": "/v1/accounts/users/update-user",
    "get-contact": "/v1/contacts/get-contact/",
    "get-user": "/v1/accounts/users/get-user/",
    "generate-qr-code": "/proxy/qr-code",
    "get-request": "/v1/contacts/get-request/",
    "accept-request": "/v1/contacts/accept-request/",
    "cancel-request": "/v1/contacts/cancel-request/",
    "create-request": "/v1/contacts/create-request",
    "check-login": "/v1/accounts/users/check-login/",
    "get-user-financial-statistics": "/v1/accounts/users/get-user-financial-statistics",
    "get-user-coupons": "/v1/organizations/get-user-coupons",
    "user-get-wallet": "/v1/finance/get-wallet",
    "users-logout": "/v1/accounts/users/logout",

    "get-user-card": "/v1/accounts/users/get-user-card",
    "add-card-to-user": "/v1/accounts/users/add-card-to-user",
    "remove-card-from-user": "/v1/accounts/users/remove-card-from-user",

    //verification
    "delete-verification": "/v1/accounts/verifications/delete-verification/",
    "verification-send-verification": "/v1/accounts/verifications/send-verification",

    //contacts
    "get-contacts": "/v1/contacts/get-contacts",
    "update-contact": "/v1/contacts/update-contact/",
    "contact-get-organizations": "/v1/organizations/get-contact-organizations",

    //tasks
    "create-task": "/v1/tasks/create-task",
    "get-task": "/v1/tasks/get-task/",
    "get-tasks": "/v1/tasks/get-tasks/",
    "delete-task": "/v1/tasks/delete-task/",

    //organization
    "get-organization": "/v1/organizations/get-organization/",
    "subscribe-to-organization": "/v1/organizations/subscribe-to-organization/",
    "unsubscribe-from-organization": "/v1/organizations/unsubscribe-from-organization/",
    "create-invitation": "/v1/organizations/create-invitation",
    "get-organization-by-invitation": "/v1/organizations/get-organization-by-invitation/",
    "get-purchase": "/v1/finance/get-purchase/",
    "set-purchase-archived": "/v1/finance/set-purchase-archived",
    "pay-purchase": "/v1/finance/pay-purchase/",
    "get-employee-rating": "/v1/organizations/get-employee-rating",
    "pay-purchase-with-cash": "/v1/finance/pay-purchase-with-cash/",
    "add-review-to-purchase": "/v1/finance/add-review-to-purchase/",
    "add-comment-to-purchase": "/v1/finance/add-comment-to-purchase/",
    "get-ref": "/v1/refs/get-ref/",
    "create-purchase": "/v1/finance/create-purchase",
    "get-user-purchases": "/v1/finance/get-user-purchases",
    "create-purchase-as-user": "/v1/finance/create-purchase-as-user",
    "get-coupons": "/v1/organizations/get-coupons/",
    "get-employees": "/v1/organizations/get-employees/",
    "get-clients": "/v1/organizations/get-clients/",
    "user-find-coupons": "/v1/organizations/find-coupons",
    "organizations-get-user-favorite-organizations": "/v1/organizations/get-user-favorite-organizations",
    "organizations-add-organization-to-user-favorite-list": "/v1/organizations/add-organization-to-user-favorite-list",
    "organizations-remove-organization-from-user-favorite-list": "/v1/organizations/remove-organization-from-user-favorite-list",

    //coupon
    "get-coupon": "/v1/organizations/get-coupon/",
    "get-category-coupons": "/v1/organizations/get-category-coupons/",
    "add-coupon-to-contact": "/v1/organizations/add-coupon-to-contact/",
    "delete-coupon-to-contact": "/v1/organizations/delete-coupon-from-contact/",
    "coupons-get-user-favorite-coupons": "/v1/organizations/get-user-favorite-coupons",
    "coupons-add-coupon-to-user-favorite-list": "/v1/organizations/add-coupon-to-user-favorite-list",
    "coupons-remove-coupon-from-user-favorite-list": "/v1/organizations/remove-coupon-from-user-favorite-list",
    "coupons-category-get": "/v1/organizations/get-organization-coupon-categories",

    //search
    "find-organizations": "/v1/organizations/find-organizations",
    "get-address-from-coords": "/v1/global/maps/get-address-from-coords",
    "get-address-suggestions": "/v1/global/maps/get-address-suggestions",

    //restorations
    "create-restoration": "/v1/accounts/restorations/create-restoration",
    "confirm-restoration": "/v1/accounts/restorations/confirm-restoration/",
    "send-restoration-code": "/v1/accounts/restorations/send-restoration-code",

    //subscriptions
    "get-first-level-subscriptions": "/v1/finance/get-first-level-subscriptions",
    "get-other-level-subscriptions": "/v1/finance/get-other-level-subscriptions",
    "get-level-subscriptions": "/v1/finance/get-level-subscriptions/",

    //withdrawal of funds
    "get-withdrawal-request-token": "/v1/finance/get-withdrawal-request-token",

    // global
    "get-global": "/v1/administration/get-global",


    // versions
    "versions-get-versions": "/v1/administration/get-versions?type=cards",

    // rating
    "rating-create-employee-rating": "/v1/organizations/create-employee-rating",

    // tips
    "tips-send-tips": "/v1/finance/send-tips",

    // invite
    "invite-get-ref": "/v1/refs/get-ref/",
    "get-user-by-invitation": "/v1/organizations/get-user-by-invitation/",

    // hidden coupon lists
    "add-coupon-to-user-hidden-list": "/v1/organizations/add-coupon-to-user-hidden-list",
    "get-user-hidden-coupons": "/v1/organizations/get-user-hidden-coupons",
    "remove-coupon-from-user-hidden-list": "/v1/organizations/remove-coupon-from-user-hidden-list",

    // wallet
    "wallet-contact-pass": "/v1/global/wallet/contact-pass/",
    "wallet-purchase-pass": "/v1/global/wallet/purchase-pass/",

    // finance
    "finance-share-purchase": "/v1/finance/share-purchase",

    // question-answer
    "get-questions-by-type": "/v1/administration/get-questions-by-type/cards",

    // log
    "log-create-log": "/v1/logs/create-log",

    // notifications
    "get-notification-settings": "/v1/notifications/get-notification-settings",
    "update-notification-settings": "/v1/notifications/update-notification-settings",

    // cities
    "cities-get-organization-cities": "/v1/organizations/get-organization-cities",
    "cities-set-user-city": "/v1/accounts/users/set-user-city",

    // mentor
    "mentor-set": "/v1/accounts/users/set-user-parent",


    // common
    "get-categories": "/v1/organizations/get-categories",

    // documents
    "documents-get": "/v1/administration/get-documents-by-type",


    // media
    "media-create": "/v1/media/create-media",
    "media-get": "/v1/media/get-media-data",

    // legal
    "legal-get-organization-documents": "/v1/legal/get-organization-documents",
    "legal-get-coupon-documents": "/v1/legal/get-coupon-documents",
}

export default urls
