import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetUnseenUserNotificationCountDTO {
    export interface Request {
        userId: string;
    };

    export interface ResponseData {
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};