import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IInvitation } from "../../../../organizations/models/Invitation";

export namespace CreateSubscriptionDTO {
    export interface Request {
        userId: string;
        invitation: IInvitation;
        organizationId: string;
    };

    export interface ResponseData {
        subscriptionId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};