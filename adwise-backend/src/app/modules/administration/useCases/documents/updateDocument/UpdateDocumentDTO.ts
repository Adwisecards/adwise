import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateDocumentDTO {
    export interface Request {
        documentId: string;
        name: string;
        description: string;
        fileMediaId: string;
        index: number;
        type: string;
    };

    export interface ResponseData {
        documentId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};