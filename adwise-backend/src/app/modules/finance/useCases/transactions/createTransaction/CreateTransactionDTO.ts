import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IUser } from "../../../../users/models/User";
import { IPurchase } from "../../../models/Purchase";
import { ISubscription } from "../../../models/Subscription";

export namespace CreateTransactionDTO {
    export interface Request {
        from: string;
        to: string;
        type: string;
        currency: string;
        sum: number;
        coupon?: ICoupon;
        subscription?: ISubscription;
        context?: string;
        timestamp?: Date;
        origin?: string;
        user?: IUser;
        organization?: IOrganization;
        purchase?: IPurchase;
        frozen: boolean;
    };

    export interface ResponseData {
        transactionId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};