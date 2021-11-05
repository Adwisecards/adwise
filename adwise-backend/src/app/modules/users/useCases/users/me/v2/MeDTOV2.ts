import { Result } from "../../../../../../core/models/Result";
import { UseCaseError } from "../../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../../organizations/models/Organization";
import { IUser } from "../../../../models/User";

export namespace MeDTOV2 {
    export interface Request {
        userId: string;
        isOrganization: boolean;
        populateEmployee: boolean;
        platform: string;
        language?: string;
    };

    export interface ResponseData {
        user?: IUser;
        organization?: IOrganization;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>
};