import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace HandleBankRequestDTO {
    export interface Request {
        TerminalKey: string;
        CustomerKey: string;
        RequestKey: string;
        Success: boolean;
        Status: 'COMPLETED' | 'REJECTED';
        PaymentId: number;
        ErrorCode: string;
        CardId: number;
        Pan: string;
        ExpDate: string;
        NotificationType: string;
    };

    export interface ResponseData {
        success: boolean;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};