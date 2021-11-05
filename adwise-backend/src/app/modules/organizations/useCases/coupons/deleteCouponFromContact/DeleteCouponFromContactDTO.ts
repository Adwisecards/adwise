import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeleteCouponFromContactDTO {
    export interface Request {
        contactId: string;
        couponId: string;
    };

    export interface ResponseData {
        couponId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};