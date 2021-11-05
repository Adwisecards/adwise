import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace ChangeSubscriptionParentDTO {
    export interface Request {
        subscriptionId: string;
        parentId: string;
        reason: string;
    };

    export interface ResponseData {
        subscriptionId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};