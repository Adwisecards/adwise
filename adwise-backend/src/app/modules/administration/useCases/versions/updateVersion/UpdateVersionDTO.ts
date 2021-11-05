import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateVersionDTO {
    export interface Request {
        versionId: string;
        type: string;
        title: string;
        version: string;
        date: string;
        comment: string;
    };

    export interface ResponseData {
        versionId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};