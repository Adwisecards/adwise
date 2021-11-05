import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateChatDTO {
    export interface Request {
        fromUserId: string;
        to: {
            id: string;
            type: string;
        };
        asOrganization?: boolean;
    };

    export interface ResponseData {
        chatId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};