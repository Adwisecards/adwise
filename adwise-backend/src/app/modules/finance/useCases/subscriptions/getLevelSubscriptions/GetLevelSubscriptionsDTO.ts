import { Result } from "../../../../../core/models/Result"
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscription } from "../../../models/Subscription";

export namespace GetLevelSubscriptionsDTO {
    export interface ISubscriptionLevel {
        level: number;
        items?: ISubscription[];
        count?: number;
    }

    export interface Request {
        userId: string;
        organizationId: string;
    };

    export interface ResponseData {
        subscriptions: ISubscriptionLevel[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};