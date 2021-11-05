import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeleteCouponDTO {
    export interface Request {
        couponId: string;
    };

    export interface ResponseData {
        couponId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};