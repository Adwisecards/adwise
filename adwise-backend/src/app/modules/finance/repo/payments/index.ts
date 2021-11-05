import { PaymentModel } from "../../models/Payment";
import { PaymentRepo } from "./implementation/PaymentRepo";

const paymentRepo = new PaymentRepo(PaymentModel);

export {
    paymentRepo
};