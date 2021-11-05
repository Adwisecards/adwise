import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IParameters } from "../../../models/ReceiverGroup";

export namespace CreateReceiverGroupDTO {
    export interface Request {
        name: string;
        parameters: IParameters;
        wantedReceiverIds?: string[];
    };

    export interface ResponseData {
        receiverGroupId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};