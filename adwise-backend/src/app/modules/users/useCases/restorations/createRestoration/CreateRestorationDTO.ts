import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateRestorationDTO {
    export interface Request {
        email: string;
        phone: string;
    };

    export interface ResponseData {
        restorationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};