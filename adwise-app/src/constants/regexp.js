import AsyncStorage from "@react-native-community/async-storage";
import ListMask from "./phone-number-masks";

const regexp = async () => {
    const indexCurrentMask = await AsyncStorage.getItem('current-mask-phone') || '0';
    const currentMask = ListMask.find((mask) => mask.id === indexCurrentMask);

    return {
        "phone": currentMask.regular,
        "url": /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i
    }
}

export default regexp;
