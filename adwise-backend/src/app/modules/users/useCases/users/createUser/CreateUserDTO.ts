import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { JsonWebToken } from "../../../models/JWT";

export namespace CreateUserDTO {
    export interface Request {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        dob: string;
        gender: string;
        pushToken?: string;
        pushTokenBusiness?: string;
        deviceToken?: string;
        deviceTokenBusiness?: string;
        pushNotificationsEnabled?: boolean;
        language?: string;
        password: string;
        organizationUser: boolean;
        noVerification: boolean;
        noCheck: boolean;
        parentRefCode: string;
        pictureMediaId?: string;
        wisewinId?: string;
    };

    export interface ResponseData {
        userId: string;
        verificationId: string;
        jwt: JsonWebToken;
    };

    export type Response = Result<CreateUserDTO.ResponseData | null, UseCaseError | null>;
};