import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../models/User";

export namespace ResolveTreeDTO {
    export interface Request {
        user: IUser;
        wisewinParentId: string;
    };

    export interface ResponseData {
        user: IUser;
        wisewinParentId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};