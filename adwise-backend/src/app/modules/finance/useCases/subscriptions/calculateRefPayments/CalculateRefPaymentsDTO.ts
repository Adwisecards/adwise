import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { IPurchase } from "../../../models/Purchase";
import { ISubscription } from "../../../models/Subscription";

export namespace CalculateRefPaymentsDTO {    
    export interface IRefPayment {
        subscription: ISubscription;
        purchase: IPurchase;
        sum: number;
        coupon: ICoupon;
        index: number;
    };
    
    export interface Request {
        purchase: IPurchase;
    };

    export interface ResponseData {
        refPayments: IRefPayment[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};