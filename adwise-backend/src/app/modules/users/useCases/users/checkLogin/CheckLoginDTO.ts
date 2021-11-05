import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CheckLoginDTO {
    export interface Request {
        login: string;
    };

    export interface ResponseData {
        exists: boolean;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};