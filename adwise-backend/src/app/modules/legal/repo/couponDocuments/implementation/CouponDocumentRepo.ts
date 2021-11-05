import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { ICouponDocument, ICouponDocumentModel } from "../../../models/CouponDocument";
import { ICouponDocumentRepo } from "../ICouponDocumentRepo";

export class CouponDocumentRepo extends Repo<ICouponDocument, ICouponDocumentModel> implements ICouponDocumentRepo {
    public async findManyByCoupon(couponId: string) {
        try {
            const couponDocuments = await this.Model.find({coupon: couponId});

            return Result.ok(couponDocuments);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByCouponAndType(couponId: string, type: string) {
        try {
            const couponDocument = await this.Model.findOne({coupon: couponId, type: type});
            if (!couponDocument) {
                return Result.fail(new RepoError('Coupon document does not exist', 404));
            }

            return Result.ok(couponDocument);            
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}