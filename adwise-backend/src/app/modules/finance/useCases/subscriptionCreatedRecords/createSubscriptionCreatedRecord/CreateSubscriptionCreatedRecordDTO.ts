import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IInvitation } from "../../../../organizations/models/Invitation";
import { IOrganization } from "../../../../organizations/models/Organization";
import { ISubscription } from "../../../models/Subscription";

export namespace CreateSubscriptionCreatedRecordDTO {
    export interface Request {
        subscription: ISubscription;
        invitation: IInvitation;
        organization: IOrganization;
        inviter: string;
        invitee: string;
        oldParent?: ISubscription;
        newParent?: ISubscription;
        reason?: string;
    };

    export interface ResponseData {
        subscriptionCreatedRecordId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};