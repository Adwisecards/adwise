import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";

export namespace GetContactPassDTO {
    export interface Request {
        contactId: string;
    };

    export interface ResponseData {
        pass: Buffer;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};