import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace AddCouponToContactDTO {
    export interface Request {
        couponId: string;
        contactId: string;
    };

    export interface ResponseData {
        couponId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
}