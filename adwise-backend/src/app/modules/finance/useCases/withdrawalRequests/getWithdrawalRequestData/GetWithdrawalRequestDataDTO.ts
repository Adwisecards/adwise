import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWithdrawalTask } from "../../../../administration/models/WithdrawalTask";
import { IUser } from "../../../../users/models/User";

export namespace GetWithdrawalRequestDataDTO {
    export interface Request {
        withdrawalRequestToken: string;
    };

    export interface ResponseData {
        user: IUser;
        tasks: IWithdrawalTask[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};