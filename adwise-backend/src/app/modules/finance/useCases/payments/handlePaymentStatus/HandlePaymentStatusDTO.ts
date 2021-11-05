import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace HandlePaymentStatusDTO {
    export interface Request {
        ip: string;
        metadata: {
            [key: string]: any;
        };
        amount: {
            value: number;
            currency: string;
        };
        event: string;
        paid: boolean;
        SpAccumulationId: string;
    };

    export interface ResponseData {
        success: boolean;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};