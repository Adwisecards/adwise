import { configProps } from "../config";
// import { PaymentService } from "./implementation/PaymentService";
import { TinkoffPaymentService } from "./implementation/TinkoffPaymentService";

// const paymentService = new PaymentService(configProps.frontendUrl, configProps.yandexKassaKey, configProps.yandexKassaShopId);
const paymentService = new TinkoffPaymentService(configProps.tinkoffKeyDefault, configProps.tinkoffPasswordDefault, configProps.tinkoffKeySplit, configProps.tinkoffPasswordSplit, configProps.tinkoffKeySafe, configProps.tinkoffKeySafeETC, configProps.tinkoffPasswordSafe, configProps.legalEmail, configProps.tinkoffUserName, configProps.tinkoffUserPassword, configProps.tinkoffRegistrationUrl, configProps.tinkoffEtcUrl, configProps.tinkoffDefaultUrl, configProps.tinkoffSplitUrl, configProps.tinkoffSafeUrl, configProps.signUrl, configProps.signKey);

export {
    paymentService
};

// paymentService.createReceiptSafe(10, 'rub', 'lalala', '002566', 'email@example.com', [{
//     Amount: 10 * 100,
//     Name: 'Tututu',
//     Price: 10 * 100,
//     Quantity: 1,
//     Tax: 'none',
//     PaymentObject: 'service'
// }], {
//     Inn: '6679028543',
//     Name: 'SITITS',
//     Phones: ['+79915144011']
// }).then(p => console.log(p));

// paymentService.createPayment(0, 'rub', '601bf18d3fa46e946218e87e', '169808').then(result => {
//     console.log(result);
// });

// paymentService.confirmPaymentSafe('449073469').then(p => console.log(p));