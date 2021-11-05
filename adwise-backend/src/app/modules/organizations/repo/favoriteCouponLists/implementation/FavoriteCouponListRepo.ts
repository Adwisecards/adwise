import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IFavoriteCouponList, IFavoriteCouponListModel } from "../../../models/FavoriteCouponList";
import { IFavoriteCouponListRepo } from "../IFavoriteCouponListRepo";

export class FavoriteCouponListRepo extends Repo<IFavoriteCouponList, IFavoriteCouponListModel> implements IFavoriteCouponListRepo {
    public async findByUser(userId: string) {
        try {
            const favoriteCouponList = await this.Model.findOne({user: userId});
            if (!favoriteCouponList) {
                return Result.fail(new RepoError('Favorite coupon list does not exist', 404));
            }

            return Result.ok(favoriteCouponList);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}