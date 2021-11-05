import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateMessageDTO {
    export interface Request {
        chatId: string;
        fromUserId: string;
        body: {
            text: string;
            media: string[];
        };
    };

    export interface ResponseData {
        messageId: string;
        chatId: string;
    };
    
    export type Response = Result<ResponseData | null, UseCaseError | null>;
};