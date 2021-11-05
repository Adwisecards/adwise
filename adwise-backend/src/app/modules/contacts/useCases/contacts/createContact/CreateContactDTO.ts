import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateContactDTO {
    export interface Request {
        firstName: string;
        lastName: string;
        description: string;
        insta: string;
        fb: string;
        vk: string;
        type: string;
        phone: string;
        email: string;
        activity: string;
        userId: string;
        website: string;
        pictureFile: {
            data: Buffer,
            filename: string;
        };
        picture?: string;
        color: string;
        pictureMediaId?: string;
    };

    export interface ResponseData {
        contactId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};