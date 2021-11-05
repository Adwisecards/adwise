import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IInvitation } from "../../../../organizations/models/Invitation";

export namespace FindAllInvitationsDTO {
    export interface Request {
        [key: string]: string | number;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
    };

    export interface ResponseData {
        invitations: IInvitation[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};