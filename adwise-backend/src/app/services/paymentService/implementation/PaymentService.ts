// import { level } from "winston";
// import { Result } from "../../../core/models/Result";
// import { logger } from "../../logger";
// import { IPaymentCreatedData, IPaymentService, ICreatePaymentData } from "../IPaymentService";
// const yandexCheckout = require('yandex-checkout');

// export class PaymentService implements IPaymentService {
//     private frontendUrl: string;
//     private yandexCheckout: any;
//     private ipWhitelist = {
//         '185.71.76.0/27': true,
//         '185.71.77.0/27': true,
//         '77.75.153.0/25': true,
//         '77.75.154.128/25': true,
//         '2a02:5180:0:1509::/64': true,
//         '2a02:5180:0:2655::/64': true,
//         '2a02:5180:0:1533::/64': true,
//         '2a02:5180:0:2669::/64': true,
//         '::ffff:213.189.219.168': true
//     }

//     public successfulStatus = 'payment.succeeded';
//     public failureStatus = 'payment.canceled';
//     public canceledStatus = 'payment.canceled';

//     constructor(frontendUrl: string, secretKey: string, shopId: string) {
//         this.frontendUrl = frontendUrl;
//         this.yandexCheckout = yandexCheckout({shopId, secretKey});
//     }

//     public async createPayment(sum: number, currency: string, description: string, paymentId: string): Promise<Result<IPaymentCreatedData | null, Error | null>> {
//         try {
//             const payment = await this.yandexCheckout.createPayment(<ICreatePaymentData>{
//                 amount: {
//                     currency,
//                     value: sum.toString()
//                 },
//                 capture: true,
//                 confirmation: {
//                     return_url: this.frontendUrl+'/'+'successful-payment',
//                     type: 'redirect'
//                 },
//                 description,
//                 metadata: {
//                     id: paymentId
//                 }
//             }, paymentId);
//             console.log(payment);
//             return Result.ok(payment);
//         } catch (ex) {
//             console.log(ex);
//             logger.error(ex.stack, ex.message);
//             return Result.fail(ex);
//         }
//     }

//     public validateNotification(ip: string) {
//         return true || (<any>this.ipWhitelist)[ip];
//     }
// };