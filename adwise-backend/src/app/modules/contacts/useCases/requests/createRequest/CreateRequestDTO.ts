import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateRequestDTO {
    export interface Request {
        from: string;
        to: string;
    };

    export interface ResponseData {
        requestId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};