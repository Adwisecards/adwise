import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeleteVerificationDTO {
    export interface Request {
        code: string;
        verificationId: string;
    };

    export interface ResponseData {
        verificationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};