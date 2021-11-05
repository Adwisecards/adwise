import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ILegalInfoRequest } from "../../../../organizations/models/LegalInfoRequest";

export namespace FindAllLegalInfoRequestsDTO {
    export interface Request {
        [key: string]: string | number;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
    };

    export interface ResponseData {
        legalInfoRequests: ILegalInfoRequest[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>; 
};