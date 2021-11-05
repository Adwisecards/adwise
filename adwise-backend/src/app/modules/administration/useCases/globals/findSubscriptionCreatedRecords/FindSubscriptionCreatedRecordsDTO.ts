import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscriptionCreatedRecord } from "../../../../finance/models/SubscriptionCreatedRecord";

export namespace FindSubscriptionCreatedRecordsDTO {
    export interface Request {
        [key: string]: string | number;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
    };

    export interface ResponseData {
        subscriptionCreatedRecords: ISubscriptionCreatedRecord[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};