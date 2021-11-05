import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IHiddenCouponList, IHiddenCouponListModel } from "../../../models/HiddenCouponList";
import { IHiddenCouponListRepo } from "../IHiddenCouponListRepo";

export class HiddenCouponListRepo extends Repo<IHiddenCouponList, IHiddenCouponListModel> implements IHiddenCouponListRepo {
    public async findByUser(userId: string) {
        try {
            const hiddenCouponList = await this.Model.findOne({user: userId});
            if (!hiddenCouponList) {
                return Result.fail(new RepoError('Hidden coupon list does not exist', 404));
            }

            return Result.ok(hiddenCouponList);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}