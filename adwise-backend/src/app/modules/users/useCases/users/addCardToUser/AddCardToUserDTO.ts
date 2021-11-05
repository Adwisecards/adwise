import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IBankRequest } from "../../../../finance/models/BankRequest";

export namespace AddCardToUserDTO {
    export interface Request {
        userId: string;
    };

    export interface ResponseData {
        bankRequest: IBankRequest;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};