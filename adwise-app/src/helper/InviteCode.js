import {
    Clipboard
} from "react-native";

const getInviteCode = async () => {
    const invite = await Clipboard.getString();
    const inValid = validateInviteCode(invite);

    if (!inValid) {
        return null
    }

    return invite
}
const validateInviteCode = (invite = '') => {
    if (!Boolean(invite)) {
        return false
    }

    return true
}

export {
    getInviteCode
}
