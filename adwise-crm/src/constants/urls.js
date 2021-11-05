const urls = {
    // base
    "prod-host": process.env.REACT_APP_PRODUCTION_HOST_API,
    "share-host": process.env.REACT_APP_SHARE_HOST,
    "auth-wise-win": process.env.REACT_APP_AUTH_WISE_WIN,

    // demo
    "get-demo-jwt": "/v1/organizations/get-demo-organization-jwt",

    // notification
    "get-organization-notifications": "/v1/organizations/get-organization-notifications",
    "get-notifications-count": "/v1/organizations/get-unseen-organization-notification-count",

    // accounts
    "sign-in": "/v1/accounts/users/sign-in?isCrm=1",
    "sign-in-with-wisewin": "/v1/accounts/users/sign-in-with-wisewin",
    "get-me": "/v1/accounts/users/me",
    "create-user": "/v1/accounts/users/create-user",
    "create-contact": "/v1/contacts/create-contact",
    "get-me-organization": "/v1/accounts/users/me?organization=1",
    "check-login": "/v1/accounts/users/check-login/",
    "delete-verification": "/v1/accounts/verifications/delete-verification/",
    "get-user": "/v1/accounts/users/get-user/",
    "user-set-user-role": "/v1/accounts/users/set-user-role",

    // contacts
    "get-contact": "/v1/contacts/get-contact/",
    "update-contact": "/v1/contacts/update-contact/",


    // tasks

    // bills
    "bills-create-purchase-clients": "/v1/finance/create-purchase-for-clients",


    // accounts
    "update-user": "/v1/accounts/users/update-user",
    "create-restoration": "/v1/accounts/restorations/create-restoration",
    "confirm-restoration": "/v1/accounts/restorations/confirm-restoration/",

    // organizations
    "create-organization": "/v1/organizations/create-organization",
    "update-organization": "/v1/organizations/update-organization/",
    "organization-create-legal-info-request": "/v1/organizations/create-legal-info-request",
    "get-categories": "/v1/organizations/get-categories",
    "create-coupon": "/v1/organizations/create-coupon",
    "get-coupons": "/v1/organizations/get-coupons/",
    "get-coupon": "/v1/organizations/get-coupon/",
    "set-coupon-indeces": "/v1/organizations/set-coupon-indeces",
    "set-coupon-disabled": "/v1/organizations/set-coupon-disabled/",
    "get-clients": "/v1/organizations/get-clients/",
    "get-client-statistics": "/v1/organizations/get-client-statistics/",
    "get-client-page": "/v1/organizations/get-client/",
    "get-employees": "/v1/organizations/get-employees/",
    "create-product": "/v1/organizations/create-product",
    "get-products": "/v1/organizations/get-products/",
    "create-employee": "/v1/organizations/create-employee",
    "set-employee-disabled": "/v1/organizations/set-employee-disabled/",
    "set-product-disabled": "/v1/organizations/set-product-disabled/",
    "get-purchases": "/v1/organizations/get-purchases/",
    "get-operations": "/v1/organizations/get-operations/",
    "get-purchase": "/v1/finance/get-purchase/",
    "pay-deposit-wallet": "/v1/finance/pay-deposit-wallet",
    "set-manager": "/v1/organizations/set-manager/",
    "get-organization-statistics": "/v1/organizations/get-organization-statistics/",
    "get-manager-organizations": "/v1/organizations/get-manager-organizations",
    "get-wisewin-statistics": "/v1/accounts/users/get-wisewin-statistics",
    "request-packet": "/v1/organizations/request-packet",
    "create-organization-shop": "/v1/organizations/create-organization-shop",
    "organization-get-organization-documents": "/v1/organizations/get-organization-documents",
    "organizations-request-payment-type": "/v1/organizations/request-payment-type",
    "organizations-create-financial-report": "/v1/organizations/get-organization-financial-report",
    "organizations-choose-wisewin-packet": "/v1/organizations/choose-wisewin-option-packet",
    "organization-set-deposit": "/v1/finance/set-wallet-deposit",


    // manager
    "manager-get-manager-operations": "/v1/accounts/users/get-manager-operations",

    // packets
    "get-packets": "/v1/organizations/get-packets",
    "add-packet-organization": "/v1/organizations/add-packet-to-organization/",

    // global
    "get-address-suggestions": "/v1/global/maps/get-address-suggestions",
    "get-address-details": "/v1/global/maps/get-address-details",
    "get-global": "/v1/administration/get-global",
    "get-country-legal-forms": "/v1/global/static/get-country-legal-forms",

    // purchase
    "create-purchase": "/v1/finance/create-purchase",


    // withdrawal
    "creating-withdrawal-request": "/v1/finance/create-legal-withdrawal-request",

    // feeadback
    "send-document": "/v1/organizations/send-document",
    "send-enrollment-request": "/v1/organizations/send-enrollment-request",

    "get-user-card": "/v1/accounts/users/get-user-card",
    "add-card-to-user": "/v1/accounts/users/add-card-to-user",
    "remove-card-from-user": "/v1/accounts/users/remove-card-from-user",

    // question-answer
    "get-questions-by-type": "/v1/administration/get-questions-by-type/crm",


    // media
    "media-get-file": "/v1/global/media/get-file",

    // refs
    "refs-get-ref": "/v1/refs/get-ref",

    // documents
    "documents-get": "/v1/administration/get-documents-by-type",

    // media
    "media-create": "/v1/media/create-media",
    "media-get": "/v1/media/get-media-data",

    // employee
    "employee-get": "/v1/organizations/get-employee",
    "employee-ratings": "/v1/organizations/get-employee-ratings",

    // legal
    "legal-get-organization-documents": "/v1/legal/get-organization-documents",
    "legal-get-coupon-documents": "/v1/legal/get-coupon-documents",
    "legal-get-form": "/v1/legal/get-organization-legal",
    "legal-send-form": "/v1/legal/create-legal",


    // push notifications
    "get-notifications-send": "/v1/notifications/get-organization-notifications",
    "push-notifications-send": "/v1/notifications/send-notification",

    // coupon category
    "coupon-category-get": "/v1/organizations/get-organization-coupon-categories",
    "coupon-category-create": "/v1/organizations/create-coupon-category",
};

export default urls
