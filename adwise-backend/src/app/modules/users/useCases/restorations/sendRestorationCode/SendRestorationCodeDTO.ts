import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SendRestorationCodeDTO {
    export interface Request {
        restorationId: string;
    };

    export interface ResponseData {
        restorationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};