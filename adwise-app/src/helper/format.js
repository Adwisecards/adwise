import AsyncStorage from "@react-native-community/async-storage";
import ListMask from "../constants/phone-number-masks";


const formatPhoneNumber = (str) => {
    let cleaned = ('' + str).replace(/\D/g, '');
    let match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
        return ['+', match[1], ' ', match[2], ' ', match[3], '-', match[4], '-', match[5]].join('')
    }

    return null;
}

const awaitFormatPhone = async ( str ) => {
    const indexCurrentMask = await AsyncStorage.getItem('current-mask-phone') || '0';
    const currentMask = ListMask.find((mask) => mask.id === indexCurrentMask);
    let phoneNumber = currentMask.code;

    if (str.length !== currentMask.lengthPhone){
        return null
    }

    const clearPhoneNumber = str.slice(currentMask.codeLength);
    phoneNumber += clearPhoneNumber.replace(currentMask.regularTransform[0], currentMask.regularTransform[1]);

    return phoneNumber
}

const formatMoney = (amount, decimalCount = 0, decimal = " ", thousands = " ") => {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
}

const formatCode = (code) => {
    let cleaned = ('' + code).replace(/\D/g, '');
    let matchEight = cleaned.match(/^(\d{3})(\d{2})(\d{3})$/);
    let matchNine = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);

    if (matchEight) {
        return [matchEight[1], '-', matchEight[2], '-', matchEight[3]].join('')
    }
    if (matchNine) {
        return [matchNine[1], '-', matchNine[2], '-', matchNine[3]].join('')
    }

    return code
}

export {
    awaitFormatPhone,
    formatPhoneNumber,
    formatMoney,
    formatCode
}
