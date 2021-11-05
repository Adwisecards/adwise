import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetUserFinancialOperationsDTO {
    export interface Request {
        userId: string;
        limit: number;
        page: number;
    };

    export interface ResponseData {
        operations: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};