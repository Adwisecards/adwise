import allTranslations from "../localization/allTranslations";
import localization from "../localization/localization";

export default {
    service: allTranslations(localization['coupon_types.service']),
    product: allTranslations(localization['coupon_types.product'])
}
