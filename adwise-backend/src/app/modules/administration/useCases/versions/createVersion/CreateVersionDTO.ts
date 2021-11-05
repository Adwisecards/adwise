import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateVersionDTO {
    export interface Request {
        title: string;
        date: string;
        version: string;
        comment: string;
        type: string;
    };

    export interface ResponseData {
        versionId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};