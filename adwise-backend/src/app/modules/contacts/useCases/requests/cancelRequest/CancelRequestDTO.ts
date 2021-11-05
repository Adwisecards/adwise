import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CancelRequestDTO {
    export interface Request {
        requestId: string;
    };

    export interface ResponseData {
        requestId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};