import AsyncStorage from "@react-native-community/async-storage";
import ListMask from "../constants/phone-number-masks";

const validationPhone = async (phone) => {
    const indexCurrentMask = await AsyncStorage.getItem('current-mask-phone') || '0';
    const currentMask = ListMask.find((mask) => mask.id === indexCurrentMask);

    const phoneNumber = phone.replace(/\D+/g,"");

    return phoneNumber.length === currentMask.lengthPhone;
}
const convertingPhone = async (phone) => {}

export {
    validationPhone,
    convertingPhone
}
