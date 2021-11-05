import {DropDownHolder} from "../components";

const scanningQrCode = (props) => {

    const isValid = validationCheck(props.data);

};

const validationCheck = (url) => {
    let isValid = true;

    if ( url.indexOf('https://adwise.cards') <= 0 || url.indexOf('https://dev.adwise.cards') <= 0 ) {
        isValid = false;

        DropDownHolder.alert('info', "Системное уведомление", "Данные QR код не поддерживается системой.");
    }

    return isValid
};
const getTypeLink = () => {};

export {
    scanningQrCode
}
