import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateReceiverGroupDTO {
    export interface Request {
        receiverGroupId: string;
    };

    export interface ResponseData {
        receiverGroupId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};