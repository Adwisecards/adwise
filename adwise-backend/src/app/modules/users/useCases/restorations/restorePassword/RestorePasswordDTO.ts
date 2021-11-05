import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace RestorePasswordDTO {
    export interface Request {
        restorationId: string;
        password: string;
    };

    export interface ResponseData {
        restorationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};