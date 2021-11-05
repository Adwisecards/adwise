import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../../users/models/User";

export namespace GetUserByInvitationDTO {
    export interface Request {
        invitationId: string;
    };

    export interface ResponseData {
        user: IUser;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};