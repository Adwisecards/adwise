import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetCashierTipsDTO {
    export interface ITips {
        timestamp: Date;
        sum: number;
    };

    export interface Request {
        cashierContactId: string;
        limit: number;
        page: number;
        all: boolean;
    };

    export interface ResponseData {
        tips: ITips[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};  