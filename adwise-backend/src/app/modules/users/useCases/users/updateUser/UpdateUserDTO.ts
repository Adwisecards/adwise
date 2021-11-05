import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateUserDTO {
    export interface Request {
        firstName: string;
        lastName: string;
        password: string;
        email: string;
        phone: string;
        gender: string;
        dob: string;
        insta: string;
        vk: string;
        fb: string;
        website: string;
        userId?: string;
        activity: string;
        description: string;
        pictureFile: {
            data: Buffer;
            filename: string;
        };
        picture?: string;
        legal: {
            form: string;
            country: string;
            info: {[key: string]: string};
        };
        pictureMediaId?: string;
    };

    export interface ResponseData {
        userId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};