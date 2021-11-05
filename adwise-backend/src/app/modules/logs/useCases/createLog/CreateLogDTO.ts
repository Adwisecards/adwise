import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";

export namespace CreateLogDTO {
    export interface Request {
        platform: string;
        app: string
        event: string;
        isError: boolean;
        userId: string;
        meta: {[key: string]: any};
        message: string;
    };

    export interface ResponseData {
        logId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};