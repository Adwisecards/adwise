import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../models/Contact";

export namespace GetContactDTO {
    export interface Request {
        contactId: string;
    };

    export interface ResponseData {
        contact: IContact;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};