import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { ISubscription } from "../../../../finance/models/Subscription";
import { IUser } from "../../../../users/models/User";
import { IInvitation } from "../../../models/Invitation";
import { IOrganization } from "../../../models/Organization";

export namespace SubscribeToOrganizationDTO {
    export interface Request {
        organizationId: string;
        contactId: string;
        userId: string;
        invitationId: string;
        followingUserId: string;
        resolvedObjects?: {
            user?: IUser;
            organization?: IOrganization;
            invitation?: IInvitation;
            contact?: IContact;
        };
        additionalSubscriptions?: boolean;
    };

    export interface ResponseData {
        organizationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};