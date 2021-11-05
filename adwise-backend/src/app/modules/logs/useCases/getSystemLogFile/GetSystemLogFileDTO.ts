import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";

export namespace GetSystemLogFileDTO {
    export interface Request {
        systemLogFilename: string;
    };

    export interface ResponseData {
        systemLogFile: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};