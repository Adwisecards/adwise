import axiosInstance from "../agent/agent";
import urls from "../constants/urls";
import {getCurrentLanguage} from "./language";

const getAddressFromCoords = async (coords) => {}
const getCoordsFromAddress = async (address) => {
    const language = getCurrentLanguage();
    const placeId = await axiosInstance.get(`${urls["get-address-suggestions"]}?search=${address}`).then((response) => {
        return response.data?.data?.addressSuggestions[0]?.addressId;
    }).catch((error) => {
        return null
    });
    if (!placeId) {
        return null
    }
    return await axiosInstance.get(`${urls["get-address-details"]}/${placeId}`).then((response) => {
        return response.data?.data?.addressDetails?.coords
    }).catch(() => {
        return null
    })
}
const getAddressId = async (address, details) => {
    const language = getCurrentLanguage();
    const coords = await getCoordsFromAddress(address);
    let data = {
        lat: coords[0] || '',
        long: coords[1] || '',
    };

    if (details) {
        data.details = details;
    }

    return await axiosInstance.post(`/v1/maps/create-address-from-coords`, data).then((response) => {
        return response.data.data.address._id
    }).catch(() => {
        return ""
    });
}
const getIsAddressValid = async (organization) => {

    if (!organization?.placeId) {
        return false
    }

    const addressId = await getAddressId(organization?.placeId);
    const address = await axiosInstance.get(`/v1/global/maps/get-address-details/${ addressId }`).then((res) => {
        return res.data.data
    }).catch((error) => {
        return null
    })

    if (!address) {
        return false
    }


    console.log('addressId: ', addressId);
    console.log('address: ', address);
    console.log('organization: ', organization);
}

export {
    getCoordsFromAddress,
    getAddressFromCoords,
    getIsAddressValid,
    getAddressId
}
