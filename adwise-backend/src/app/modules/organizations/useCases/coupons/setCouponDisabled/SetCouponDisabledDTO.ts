import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetCouponDisabledDTO {
    export interface Request {
        couponId: string;
        disabled: boolean;
    };

    export interface ResponseData {
        couponId: string;
    };

    export type Response = Result<SetCouponDisabledDTO.ResponseData | null, UseCaseError | null>;
};