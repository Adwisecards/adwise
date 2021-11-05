import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeleteContactDTO {
    export interface Request {
        contactId: string;
    };

    export interface ResponseData {
        contactId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};