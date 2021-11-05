import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateOrganizationDTO {
    type Day = {
        from: string;
        to: string;
    };

    export interface Request {
        organizationId: string;
        userId: string;
        description: string;
        briefDescription: string;
        addressId: string;
        socialMedia: {
            vk: string;
            insta: string;
            fb: string;
        };
        tags: string[];
        categoryId: string;
        website: string;
        emails: string[];
        phones: string[];
        schedule: {
            monday: Day;
            tuesday: Day;
            wednesday: Day;
            thursday: Day;
            friday: Day;
            saturday: Day;
            sunday: Day;
        };
        distributionSchema: {
            first: number;
            other: number;
        };
        colors: {
            primary: string;
            secondary: string;
        }
        cashback: number;
        pictureMediaId?: string;
        mainPictureMediaId?: string;
        addressCoords: number[];
    };

    export interface ResponseData {
        organizationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};