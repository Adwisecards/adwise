import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateVerificationDTO {
    export interface Request {
        userId: string;
        password: string;
    };

    export interface ResponseData { 
        verificationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};