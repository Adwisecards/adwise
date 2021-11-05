import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateLegalDTO {
    export interface Request {
        legalId: string;
        userId: string;
    };

    export interface ResponseData {
        legalId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};