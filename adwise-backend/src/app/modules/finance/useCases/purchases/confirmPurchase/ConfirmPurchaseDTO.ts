import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobal } from "../../../../administration/models/Global";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IUser } from "../../../../users/models/User";
import { IPayment } from "../../../models/Payment";
import { IPurchase } from "../../../models/Purchase";
import { IWallet } from "../../../models/Wallet";

export namespace ConfirmPurchaseDTO {
    export interface Request {
        purchaseId: string;
        cash?: boolean;
        split?: boolean;
        safe?: boolean;
        resolvedObjects?: {
            purchase: IPurchase;
            payment: IPayment;
            userWallet: IWallet;
            organizationWallet: IWallet;
            organization: IOrganization;
            user: IUser;
            coupons: ICoupon[];
            global: IGlobal;
        };
    };

    export interface ResponseData {
        purchaseId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};