import axios from "axios";

const getDataOrganizationFromInn = async ({query}) => {
    const searchUrlOrganization = process.env.REACT_APP_DADATA_URL_SEARCH_ORGANIZATION;
    const apiKey = process.env.REACT_APP_DADATA_API_KEY;

    return await axios.post(searchUrlOrganization,{
            query
        },{
            headers: {
                "Authorization": "Token " + apiKey
            }
        }).then((response) => {
        return response.data
    }).catch((error) => {
        return null
    });
};
const getDataBankFromBik = async ({query}) => {
    const searchUrlBank = process.env.REACT_APP_DADATA_URL_SEARCH_BANK;
    const apiKey = process.env.REACT_APP_DADATA_API_KEY;

    return await axios.post(searchUrlBank,{
            query
        },{
            headers: {
                "Authorization": "Token " + apiKey
            }
        }).then((response) => {
        return response.data
    }).catch((error) => {
        return null
    });
};

export {
    getDataOrganizationFromInn,
    getDataBankFromBik
}
