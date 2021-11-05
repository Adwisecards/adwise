import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IPurchase } from "../../../models/Purchase";
import { ISubscription } from "../../../models/Subscription";

export namespace DistributeToSubscriptionsDTO {
    export interface IRefPayment {
        subscription: ISubscription;
        purchase: IPurchase;
        sum: number;
        coupon: ICoupon;
    };

    export interface Request {
        refPayments: IRefPayment[];
        cash?: boolean;
        split?: boolean;
        safe?: boolean;
    };

    export interface ResponseData {
        pointsDistributed: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};