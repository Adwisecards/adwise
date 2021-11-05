import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../models/User";

export namespace GetUserDTO {
    export interface Request {
        userId: string;
        populateEmployee: boolean;
    };

    export interface ResponseData {
        user: IUser;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};