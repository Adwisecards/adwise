import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchase } from "../../../models/Purchase";

export namespace GetUserPurchasesDTO {
    export interface Request {
        userId: string;
        limit: number;
        page: number;
        multiple?: boolean;
        types?: ('confirmed' | 'new' | 'shared' | 'processing' | 'complete' | 'archived' | 'canceled')[];
        dateFrom?: string;
        dateTo?: string;
        refCode?: string;
        organizationName?: string;
    };

    export interface ResponseData {
        purchases: IPurchase[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};