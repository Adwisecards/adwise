import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IDocument } from "../../../models/Document";

export namespace GetDocumentsByTypeDTO {
    export interface Request {
        type: string;
    };

    export interface ResponseData {
        documents: IDocument[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};