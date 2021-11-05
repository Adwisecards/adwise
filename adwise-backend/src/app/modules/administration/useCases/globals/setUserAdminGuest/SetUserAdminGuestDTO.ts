import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetUserAdminGuestDTO {
    export interface Request {
        userId: string;
        targetUserId: string;
        adminGuest: boolean;
    };

    export interface ResponseData {
        userId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
