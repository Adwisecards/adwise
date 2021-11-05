import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IReceiverGroup } from "../../../../notification/models/ReceiverGroup";

export namespace FindAllReceiverGroupsDTO {
    export interface Request {
        [key: string]: string | number | boolean;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
    };

    export interface ResponseData {
        receiverGroups: IReceiverGroup[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};