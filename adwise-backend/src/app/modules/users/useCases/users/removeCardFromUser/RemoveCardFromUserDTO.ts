import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace RemoveCardFromUserDTO {
    export interface Request {
        userId: string;
    };

    export interface ResponseData {
        success: boolean;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};