import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetVerificationDTO {
    export interface Request {
        userId: string;
    };

    export interface ResponseData {
        verificationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};