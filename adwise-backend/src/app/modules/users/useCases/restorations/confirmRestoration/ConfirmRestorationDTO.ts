import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace ConfirmRestorationDTO {
    export interface Request {
        restorationId: string;
        code: string;
    };

    export interface ResponseData {
        restorationId: string;
        jwt: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};