import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace ExportReceiverGroupDTO {
    export interface Request {
        receiverGroupId: string;
    };

    export interface ResponseData {
        data: Buffer;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};