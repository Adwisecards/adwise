import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";

export namespace GetSystemLogFilenamesDTO {
    export interface Request {
        
    };

    export interface ResponseData {
        systemLogFilenames: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};