import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetCouponIndecesDTO {
    export interface Request {
        coupons: {
            [key: string]: string;
        }
    };

    export interface ResponseData {
        ids: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
}