import queryString from "query-string";
import * as Linking from "expo-linking";
import variables from "../constants/variables";

const getParamsInitialUrl = async () => {
    const url = await Linking.getInitialURL();

    const mode = (variables.production_mode) ? 'prod' : 'develop';

    if (!url) {
        return null
    }

    let paramsLink = null;
    let path = null;
    let queryParams = null;

    if (mode === 'prod') {
        paramsLink = url.split('?');
        path = paramsLink[0].split('//')[1];
        queryParams = queryString.parse(paramsLink[1]);
    } else {
        paramsLink = url.split('?');
        path = paramsLink[0].split('/')[4];
        queryParams = queryString.parse(paramsLink[1]);
    }

    switch (path) {
        case 'getting-organization-coupon': {
            return {
                type: 'getting-organization-coupon',
                organizationId: queryParams.organizationId,
                invitation: queryParams.inviteId,

                couponId: queryParams.couponId,

                isNextCoupon: true
            }
        }
        case 'company-sign': {
            return {
                type: 'company-sign',
                organizationId: queryParams.organizationId,
                invitation: queryParams.inviteId
            }
        }
        case 'cutaway': {
            return {
                type: 'cutaway',
                ref: queryParams.userId
            }

            return null
        }
        default: {
            return null
        }
    }
}

export {
    getParamsInitialUrl
}
