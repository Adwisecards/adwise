import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CheckIncorrectPurchasesDTO {
    export interface Request {

    };

    export interface ResponseData {
        incorrectPurchaseIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};