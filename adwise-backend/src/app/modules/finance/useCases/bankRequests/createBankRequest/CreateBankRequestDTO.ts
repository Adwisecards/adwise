import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IBankRequest } from "../../../models/BankRequest";

export namespace CreateBankRequestDTO {
    export interface Request {
        type: string;
        ref: string;
        customerId: string;
    };

    export interface ResponseData {
        bankRequest: IBankRequest;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};