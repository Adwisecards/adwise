import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { IPurchase } from "../../../models/Purchase";
import { ISubscription } from "../../../models/Subscription";

export namespace CalculatePurchaseMarketingDTO {
    export interface IRefPayment {
        subscription: ISubscription;
        purchase: IPurchase;
        sum: number;
        coupon: ICoupon;
        index: number;
    };

    export interface ICouponWithOfferSum {
        coupon: ICoupon;
        offerSum: number;
    };

    export interface ICouponWithMarketing {
        coupon: ICoupon;
        offerSum: number;
        refSum: number;
        totalSum: number;
        adwiseSumForCash: number;
        totalSumForCash: number;
        paymentGatewaySum: number;
    }

    export interface Request {
        purchase: IPurchase;
    };

    export interface ResponseData {
        totalSum: number;
        totalSumForCash: number;

        adwiseSum: number;
        adwiseSumForCash: number;
        managerSum: number;
        offerTotalSum: number;
        offerPayments: number[];
        refSum: number;
        paymentGatewaySum: number;
        refPayments: IRefPayment[];
        couponsWithOfferSum: ICouponWithOfferSum[];
        couponsWithMarketing: ICouponWithMarketing[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};