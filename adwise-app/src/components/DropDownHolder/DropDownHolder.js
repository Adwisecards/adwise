import {showMessage} from "react-native-flash-message";

const types = {
    "success": "success",
    "info": "info",
    "warn": "warning",
    "error": "danger",
};

class DropDownHolder {
    static dropDown;
    static modalNotification;

    static setDropDown(dropDown) {
        this.dropDown = dropDown;
    }
    static setModalNotification(modalNotification) {
        this.modalNotification = modalNotification;
    }

    static getDropDown() {
        return this.dropDown;
    }
    static getModalNotification() {
        return this.modalNotification;
    }

    static alert(type, title, message, duration = 5000, isHideNavigation) {
        showMessage({
            message: title,
            description: message,
            type: types[type],
            duration: duration,
            isHideNavigation
        });
    }
    static modal(type, title, message, duration = 10000) {
        this.modalNotification?.onOpen({
            type,
            title,
            message,
            duration,
        });
    }
}

export default DropDownHolder
