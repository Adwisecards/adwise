import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetUserJwtDTO {
    export interface Request {
        userId: string;
    };

    export interface ResponseData {
        jwt: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};