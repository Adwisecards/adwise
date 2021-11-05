const openApp = () => {
    var iframe = document.createElement("iframe");
    // var uri = `exp://14.0.0.161:19000/--/`;
    var uri = `ad.wise.win://`;

    iframe.onload = function() {
        window.location = uri;
    };
    iframe.src = uri;
    iframe.setAttribute("style", "display:none;");

    window.location = uri;
}
const openAccountPage = ({ userId }) => {
    var iframe = document.createElement("iframe");
    // var uri = `exp://14.0.0.161:19000/--/cutaway?userId=${ userId }`;
    var uri = `ad.wise.win://cutaway?userId=${ userId }`;

    iframe.onload = function() {
        window.location = uri;
    };
    iframe.src = uri;
    iframe.setAttribute("style", "display:none;");
    // document.body.appendChild(iframe);

    window.location = uri;
};
const openCompanyPage = ({ organizationId, inviteId }) => {
    var iframe = document.createElement("iframe");
    // var uri = `exp://14.0.0.161:19000/--/company-sign?organizationId=${ organizationId }&inviteId=${ inviteId }`;
    var uri = `ad.wise.win://company-sign?organizationId=${ organizationId }&inviteId=${ inviteId }`;

    iframe.onload = function() {
        window.location = uri;
    };
    iframe.src = uri;
    iframe.setAttribute("style", "display:none;");
    // document.body.appendChild(iframe);

    window.location = uri;
};
const openCompanyCouponPage = ({ couponId, organizationId, inviteId }) => {
    var iframe = document.createElement("iframe");
    // var uri = `exp://14.0.0.161:19000/--/getting-organization-coupon?couponId=${couponId}&organizationId=${ organizationId }&inviteId=${ inviteId }`;
    var uri = `ad.wise.win://getting-organization-coupon?couponId=${couponId}&organizationId=${ organizationId }&inviteId=${ inviteId }`;

    iframe.onload = function() {
        window.location = uri;
    };
    iframe.src = uri;
    iframe.setAttribute("style", "display:none;");
    // document.body.appendChild(iframe);

    window.location = uri;
}

const openCashierPurchase = ({ purchaseId }) => {
    var iframe = document.createElement("iframe");
    // var uri = `exp://14.0.0.161:19000/--/purchase?purchaseId=${ purchaseId }`;
    var uri = `cards.adwise.business://purchase?purchaseId=${ purchaseId }`;

    iframe.onload = function() {
        window.location = uri;
    };
    iframe.src = uri;
    iframe.setAttribute("style", "display:none;");
    // document.body.appendChild(iframe);

    window.location = uri;
}

const openCouponPage = (props) => {}

export {
    openApp,
    openCompanyPage,
    openCouponPage,
    openCompanyCouponPage,
    openAccountPage,
    openCashierPurchase
}
