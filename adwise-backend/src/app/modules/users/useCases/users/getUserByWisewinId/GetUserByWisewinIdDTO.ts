import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../models/User";

export namespace GetUserByWisewinIdDTO {
    export interface Request {
        wisewinId: string;
    };

    export interface ResponseData {
        user: IUser;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};