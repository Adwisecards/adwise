import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateDocumentDTO {
    export interface Request {
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