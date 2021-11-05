import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchase } from "../../../../finance/models/Purchase";

export namespace GetOrganizationPurchasesDTO {
    export interface Request {
        limit: number;
        page: number;
        organizationId: string;
        dateFrom?: string;
        dateTo?: string;
        export?: boolean;
        order?: number;
        sortBy?: string;
        multiple?: boolean;
        types?: ('confirmed' | 'new' | 'shared' | 'processing' | 'complete' | 'archived' | 'canceled')[];
        refCode?: string;
        cashierContactId?: string;
        purchaserContactId?: string;
    };

    export interface ResponseData {
        purchases: IPurchase[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};