import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateContactDTO {
    export interface Request {
        firstName: string;
        lastName: string;
        description: string;
        insta: string;
        fb: string;
        vk: string;
        phone: string;
        email: string;
        activity: string;
        contactId?: string;
        website: string;
        color: string;
        pictureFile: {
            data: Buffer;
            filename: string;
        };
        picture?: string;
        tipsMessage: string;
        pictureMediaId?: string;
    };

    export interface ResponseData {
        contactId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};