import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace AddCommentToTransactionDTO {
    export interface Request {
        transactionId: string;
        comment: string;
    };

    export interface ResponseData {
        transactionId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};