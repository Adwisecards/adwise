import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscription } from "../../../models/Subscription";

export namespace GetOtherLevelSubscriptionsDTO {
    export interface Request {
        userId: string;
    };

    export interface ResponseData {
        subscriptions: ISubscription[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};