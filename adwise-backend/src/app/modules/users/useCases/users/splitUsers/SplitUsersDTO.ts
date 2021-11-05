import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SplitUsersDTO {
    export interface Request {

    };

    export interface ResponseData {
        userIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};