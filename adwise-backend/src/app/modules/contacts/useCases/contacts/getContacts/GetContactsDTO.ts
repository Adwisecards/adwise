import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetContactsDTO {
    export interface Request {
        contacts: {
            phone: string;
            email: string;
            id: string;
        }[];
    };

    export interface ResponseData {
        contacts: any[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};