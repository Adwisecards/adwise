import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IPacket } from "../../../../organizations/models/Packet";
import { IUser } from "../../../models/User";

export namespace GetWisewinManagerStatisticsDTO {
    export interface Request {
        wisewinId: string;
    };

    export interface ResponseData {
        firstRefs: number;
        otherRefs: number;
        bonusPoints: number;
        purchaseSum: number;
        managerOrganizationCount: number;
        marketingSum: number;
        remainingPackets: number;
        organizationPacket: IPacket;
        organizationBalance: number;
        userBalance: number;
        refCode: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};