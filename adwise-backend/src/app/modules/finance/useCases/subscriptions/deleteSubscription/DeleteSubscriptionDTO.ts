import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeleteSubscriptionDTO {
    export interface Request {
        userId: string;
        organizationId: string;
    };

    export interface ResponseData {
        subscriptionId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};