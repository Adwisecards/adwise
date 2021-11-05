import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateCouponStatisticsDTO {
    export interface Request {

    };

    export interface ResponseData {
        couponIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};