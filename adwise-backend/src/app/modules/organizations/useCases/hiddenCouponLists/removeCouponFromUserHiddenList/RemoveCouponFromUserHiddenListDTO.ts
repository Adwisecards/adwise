import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace RemoveCouponFromUserHiddenListDTO {
    export interface Request {
        userId: string;
        couponId: string;
    };

    export interface ResponseData {
        couponId: string
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};