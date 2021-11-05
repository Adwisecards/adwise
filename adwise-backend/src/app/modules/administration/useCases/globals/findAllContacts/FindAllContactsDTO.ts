import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";

export namespace FindAllContactsDTO {
    export interface Request {
        [key: string]: string | number;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
    };

    export interface ResponseData {
        contacts: IContact[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};