import Joi from "joi";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ILegal } from "../../../models/Legal";

export namespace GetOrganizationLegalsDTO {
    export interface Request {
        organizationId: string;
        userId: string;
    };

    export interface ResponseData {
        legals: ILegal[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};