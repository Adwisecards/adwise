import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";

export namespace GetOrganizationCashierContactsDTO {
    export interface Request {
        organizationId: string;
    };

    export interface ResponseData {
        contacts: IContact[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};