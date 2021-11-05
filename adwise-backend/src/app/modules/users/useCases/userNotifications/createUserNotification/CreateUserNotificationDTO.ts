import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";

export namespace CreateUserNotificationDTO {
    export interface Request {
        userId: string;
        type: string;
        level: string;

        contactId?: string;
        purchaseId?: string;
        organizationId?: string;
    };

    export interface ResponseData {
        userNotificationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};