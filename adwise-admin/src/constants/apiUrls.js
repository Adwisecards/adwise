const apiUrls = {
    // account
    "sign-in": "/accounts/users/sign-in",
    "user-me": "/accounts/users/me",
    "get-user-jwt": "/accounts/users/get-user-jwt",

    // organizations
    "find-organizations": "/administration/find-organizations",
    "set-organization-packet": "/organizations/set-organization-packet",
    "add-packet-to-organization": "/organizations/add-packet-to-organization",
    "choose-wisewin-option-packet": "/organizations/choose-wisewin-option-packet",
    "set-organization-disabled": "/organizations/set-organization-disabled",
    "set-organization-signed": "/organizations/set-organization-signed",
    "get-organization-ref-tree": "/administration/get-organization-ref-tree",
    "get-organization": "/organizations/get-organization",
    "organization-create-organization-shop": "/organizations/create-organization-shop/",
    "organization-set-organization-cash": "/organizations/set-organization-cash",
    "organization-set-organization-payment-type": "/organizations/set-organization-payment-type/",
    "organization-update-organization": "/organizations/update-organization/",
    "organization-set-organization-tips": "/organizations/set-organization-tips",
    "organization-set-organization-global": "/administration/set-organization-global",
    "organization-set-organization-online": "/organizations/set-organization-online",
    "organization-set-deposit": "/finance/set-wallet-deposit",

    // users
    "find-users": "/administration/find-users",
    "find-subscription-created-records": "/administration/find-subscription-created-records",
    "set-user-admin": "/administration/set-user-admin",
    "set-user-guest": "/administration/set-user-admin-guest",
    "get-user-ref-tree": "/accounts/users/get-user-tree",
    "get-user-ref-tree-children": "/accounts/users/get-user-tree-children",
    "user-update-user": "/accounts/users/update-user",
    "get-user": "/accounts/users/get-user",

    // categories
    "get-categories": "/organizations/get-categories",
    "delete-category": "/organizations/delete-category",
    "create-category": "/organizations/create-category",

    // packets
    "get-packets": "/organizations/get-packets",
    "get-wisewin-option-packets": "/organizations/get-wisewin-option-packets",
    "create-packet": "/organizations/create-packet",
    "delete-packet": "/organizations/delete-packet",
    "update-packet": "/organizations/update-packet",
    "set-packet-disabled": "/organizations/set-packet-disabled",

    // transactions
    "find-transactions": "/administration/find-transactions",
    "set-transaction-disabled": "/finance/set-transaction-disabled",

    // purchases
    "find-purchases": "/administration/find-purchases",

    // coupons
    "find-coupons": "/administration/find-coupons",

    // global
    "get-global": "/administration/get-global",
    "update-global": "/administration/update-global",
    "create-global-shop": "/administration/create-global-shop",

    // tasks
    "add-task": "/administration/add-task",

    // document
    "document-get": "/administration/get-documents-by-type",
    "add-document": "/administration/create-document",
    "document-delete": "/administration/delete-document",
    "document-update": "/administration/update-document",

    // withdrawal-requests
    "find-withdrawal-requests": "/administration/find-withdrawal-requests",
    "create-legal-withdrawal-request": "/finance/create-legal-withdrawal-request",
    "update-withdrawal-request": "/finance/update-withdrawal-request",
    "set-withdrawal-request-satisfied": "/finance/set-withdrawal-request-satisfied",
    "set-legal-withdrawal-request-satisfied": "/finance/set-legal-withdrawal-request-satisfied",

    // payments
    "find-payments": "/administration/find-payments",

    // sold-packets
    "find-sold-packets": "/administration/find-sold-packets",

    // finance
    "correct-balance": "/finance/correct-balance",
    "finance-set-purchase-paid": "/finance/set-purchase-paid",

    // versions
    "versions-get-versions": "/administration/get-versions",
    "versions-create-version": "/administration/create-version",
    "versions-update-version": "/administration/update-version",
    "versions-delete-version": "/administration/delete-version",

    // tips
    "tips-find-tips": "/administration/find-tips",

    // contacts
    "contacts-find-contacts": "/administration/find-contacts",
    "get-contact": "/contacts/get-contact",

    "get-user-card": "/v1/accounts/users/get-user-card",


    "purchase-cancel-purchase": "/finance/cancel-purchase",

    "find-subscriptions": "/administration/find-subscriptions",
    "change-subscription-parent": "/finance/change-subscription-parent/",

    // push notification
    "find-notifications": "/administration/find-notifications",
    "send-notification": "/notifications/send-notification",
    "find-receiver-groups": "/administration/find-receiver-groups",
    "create-receiver-group": "/notifications/create-receiver-group",
    "update-receiver-group": "/notifications/update-receiver-group",
    "export-receiver-group": "/notifications/export-receiver-group",

    // question-answer
    "create-question-category": "/administration/create-question-category",
    "get-question-categories": "/administration/get-question-categories",
    "delete-question-category": "/administration/delete-question-category",
    "get-questions": "/administration/get-questions-by-type",
    "create-question": "/administration/create-question",
    "delete-question": "/administration/delete-question",
    "update-question": "/administration/update-question",

    // logos
    "logs-find-logs": "/administration/find-logs",
    "get-system-log-filenames": "/logs/get-system-log-filenames",
    "get-system-log-file": "/logs/get-system-log-file",

    // refs
    "refs-find-refs": "/administration/find-refs",

    // legal-info-requests
    "find-legal-info-requests": "/administration/find-legal-info-requests",
    "satisfy-legal-info-request": "/organizations/satisfy-legal-info-request",
    "reject-legal-info-request": "/organizations/reject-legal-info-request",

    // accumulations
    "accumulations-find": "/administration/find-accumulations",

    // refs
    "get-ref": "/refs/get-ref",

    // mentor
    "mentor-set": "/accounts/users/set-user-parent",

    // invitations
    "invitations-find": "/administration/find-invitations",

    // advantage
    "advantage-create": "/administration/create-advantage",
    "advantage-get": "/administration/get-advantages",
    "advantage-update": "/administration/update-advantage",
    "advantage-delete": "/administration/delete-advantage",

    // partner
    "partner-get": "/administration/get-partners",
    "partner-create": "/administration/create-partner",
    "partner-update": "/administration/update-partner",
    "partner-delete": "/administration/delete-partner",

    // media
    "media-create": "media/create-media",
    "media-get": "/media/get-media-data",
};


export default apiUrls
