import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IInvitation } from "../../../models/Invitation";

export namespace CreateInvitationDTO {
    export interface Request {
        organizationId: string;
        userId: string;
        couponId: string;
        invitationType: string;
    };

    export interface ResponseData {
        invitation: IInvitation;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};