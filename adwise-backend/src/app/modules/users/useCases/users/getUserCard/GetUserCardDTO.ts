import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICard } from "../../../../../services/paymentService/IPaymentService";

export namespace GetUserCardDTO {
    export interface Request {
        userId: string;
    };
    
    export interface ResponseData {
        card: ICard | null;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};