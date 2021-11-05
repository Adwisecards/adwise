import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeleteVersionDTO {
    export interface Request {
        versionId: string;
    };

    export interface ResponseData {
        versionId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};