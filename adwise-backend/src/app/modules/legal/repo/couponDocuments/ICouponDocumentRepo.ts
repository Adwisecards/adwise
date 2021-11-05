import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { ICouponDocument } from "../../models/CouponDocument";

export interface ICouponDocumentRepo extends IRepo<ICouponDocument> {
    findManyByCoupon(couponId: string): RepoResult<ICouponDocument[]>;
    findByCouponAndType(couponId: string, type: string): RepoResult<ICouponDocument>;
};