import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CheckLegalInnDTO {
    export interface Request {
        inn: string;
    };

    export interface ResponseData {
        exists: boolean;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};