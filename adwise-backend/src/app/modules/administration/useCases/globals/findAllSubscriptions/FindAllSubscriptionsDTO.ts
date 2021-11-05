import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscription } from "../../../../finance/models/Subscription";

export namespace FindAllSubscriptionsDTO {
    export interface Request {
        [key: string]: string | number | boolean;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number
    };

    export interface ResponseData {
        subscriptions: ISubscription[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};