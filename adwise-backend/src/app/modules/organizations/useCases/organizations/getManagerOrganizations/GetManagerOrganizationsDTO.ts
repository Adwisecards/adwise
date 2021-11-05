import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../models/Organization";

export namespace GetManagerOrganizationsDTO {
    export interface IManagerOrganization {
        organization: IOrganization;
        jwt: string;
        purchaseCount: number;
        purchaseSum: number;
        enabledCouponCount: number;
        couponCount: number;
    };
    
    export interface Request {
        userId: string;
    };

    export interface ResponseData {
        organizations: IManagerOrganization[]; 
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};