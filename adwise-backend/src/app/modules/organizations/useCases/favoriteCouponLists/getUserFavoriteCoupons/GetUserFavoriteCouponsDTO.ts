import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../models/Coupon";

export namespace GetUserFavoriteCouponsDTO {
    export interface Request {
        userId: string;
    };

    export interface ResponseData {
        coupons: ICoupon[];
    };
    
    export type Response = Result<ResponseData | null, UseCaseError | null>;
};