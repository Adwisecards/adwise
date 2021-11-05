import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IAccumulation } from "../../../models/Accumulation";

export namespace AccumulatePaymentDTO {
    export interface Request {
        accumulationId: string;
        sum: number;
        type: string;
        userId: string;
        paymentId: string;
    };

    export interface ResponseData {
        accumulation: IAccumulation;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};