import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../models/Contact";

export namespace FindContactsDTO {
    export interface IContactSearchResult {
        contact: string;
        items: IContact[]
    };

    export interface Request {
        userId: string;
        limit: number;
        page: number;
    };

    export interface ResponseData {
        contacts: IContactSearchResult[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};