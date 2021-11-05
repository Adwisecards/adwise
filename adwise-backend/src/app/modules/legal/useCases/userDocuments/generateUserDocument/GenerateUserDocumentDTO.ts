import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GenerateUserDocumentDTO {
    export interface Request {
        userId: string;
        type: string;
    };
    
    export interface ResponseData {
        userDocumentId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};