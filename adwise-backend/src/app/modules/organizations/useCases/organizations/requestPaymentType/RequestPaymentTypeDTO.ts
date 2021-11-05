import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace RequestPaymentTypeDTO {
    export interface Request {
        organizationId: string;
        userId: string;
        paymentType: string;
    };

    export interface ResponseData {
        success: true;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};