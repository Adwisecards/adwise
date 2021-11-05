import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateOrganizationDTO {
    type Day = {
        from: string;
        to: string;
    };

    export interface Request {
        userId: string;
        name: string;
        briefDescription: string;
        description: string;
        addressId: string;
        tags: string[];
        categoryId: string;
        emails: string[];
        phones: string[];
        distributionSchema: {
            first: number;
            other: number;
        };
        cashback: number;
        colors: {
            primary: string;
            secondary: string;
        }
        pictureMediaId: string;
        mainPictureMediaId: string;
        socialMedia: {
            vk: string;
            insta: string;
            fb: string;
        };
        schedule: {
            monday: Day;
            tuesday: Day;
            wednesday: Day;
            thursday: Day;
            friday: Day;
            saturday: Day;
            sunday: Day;
        };
        requestedPacketId: string;
    };

    export interface ResponseData {
        organizationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};