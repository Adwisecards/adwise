import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchase } from "../../../../finance/models/Purchase";
import { IWallet } from "../../../../finance/models/Wallet";
import { IOrganizationStatistics } from "../../../models/OrganizationStatistics";

export namespace UpdateOrganizationStatisticsDTO {
    export interface Request {
        organizationId?: string;
    };

    export interface ResponseData {
        organizationStatistics?: IOrganizationStatistics;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};