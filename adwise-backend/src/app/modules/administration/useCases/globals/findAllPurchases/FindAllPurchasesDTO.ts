import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchase } from "../../../../finance/models/Purchase";
import { IPurchaseWithStats } from "../../../../organizations/services/organizations/organizationStatisticsService/IOrganizationStatisticsService";

export namespace FindAllPurchasesDTO {
    export interface IStats {
        cashback: number;
        firstLevel: number;
        otherLevels: number;
        adwisePoints: number;
        managerPoints: number;
        marketingSum: number;
        paymentGatewayPoints: number;
        purchaseSum: number;
        purchaseCount: number;
        cashPurchaseCount: number;
        onlinePurchaseCount: number;
        cashPurchaseSum: number;
        onlinePurchaseSum: number;
        cashOrganizationPoints: number;
        onlineOrganizationPoints: number;
    };

    export interface Request {
        [key: string]: string | number | boolean;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number
        export: boolean;
        total: boolean;
    };

    export interface ResponseData {
        purchases: IPurchaseWithStats[];
        count: number;
        stats?: IStats;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};