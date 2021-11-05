import variables from "../constants/variables";
import axios from "../plugins/axios";
import urls from "../constants/urls";

const getRefInitialUrl = async (initialUrl) => {
    const isProd = variables.production_mode;
    const isUrlValid = initialUrl.indexOf('ref/') > -1;

    if (!isUrlValid) {
        return null
    }

    const ref = initialUrl.split('ref/').pop();

    if (!ref) {
        return null
    }

    const response = await axios('get', `${ urls["get-ref"] }${ ref }`).then((response) => {
        return response.data.data.ref
    }).catch(() => {
        return null
    });

    if (!response) {
        return null
    }

    return response
};

export default getRefInitialUrl
