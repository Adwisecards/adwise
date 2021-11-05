import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SatisfyLegalInfoRequestDTO {
    export interface Request {
        legalInfoRequestId: string;
    };

    export interface ResponseData {
        legalInfoRequestId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};