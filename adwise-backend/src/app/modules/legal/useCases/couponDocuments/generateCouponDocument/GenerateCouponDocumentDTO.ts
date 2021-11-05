import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GenerateCouponDocumentDTO {
    export interface Request {
        couponId: string;
        userId: string;
        type: string;
    };

    export interface ResponseData {
        couponDocumentId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};