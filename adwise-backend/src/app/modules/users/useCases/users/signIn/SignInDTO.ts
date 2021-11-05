import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { JsonWebToken } from "../../../models/JWT";

export namespace SignInDTO {
    export interface Request {
        login: string;
        password: string;
        pushToken?: string;
        pushTokenBusiness?: string;
        deviceToken?: string;
        deviceTokenBusiness?: string;
        pushNotificationsEnabled?: boolean;
        language?: string;
        isCashier: boolean;
        isCrm: boolean;
        isClientApp: boolean;
    };

    export interface ResponseData {
        userId: string;
        jwt: JsonWebToken;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};