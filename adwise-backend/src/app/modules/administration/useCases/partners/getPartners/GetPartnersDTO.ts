import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPartner } from "../../../models/Partner";

export namespace GetPartnersDTO {
    export interface Request {
        
    };

    export interface ResponseData {
        partners: IPartner[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};