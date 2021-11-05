import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";

export namespace RequestCallDTO {
    export interface Request {
        email: string;
        name: string;
    };

    export interface ResponseData {
        success: boolean;
    }

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};