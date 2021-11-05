import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../models/Coupon";

export namespace GetCouponDTO {
    export interface Request {
        couponId: string;
    };

    export interface ResponseData {
        coupon: ICoupon;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};