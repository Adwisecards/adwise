import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeleteDocumentDTO {
    export interface Request {
        documentId: string;
    };

    export interface ResponseData {
        documentId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};