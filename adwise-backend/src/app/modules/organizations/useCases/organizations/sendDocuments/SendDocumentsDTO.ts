import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SendDocumentsDTO {
    export interface Request {
        files: {
            filename: string;
            data: Buffer;
        }[];
        comment: string;
        userId: string;
    };

    export interface ResponseData {
        success: boolean;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};