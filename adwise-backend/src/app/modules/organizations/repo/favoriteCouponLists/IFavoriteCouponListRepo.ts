import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IFavoriteCouponList } from "../../models/FavoriteCouponList";

export interface IFavoriteCouponListRepo extends IRepo<IFavoriteCouponList> {
    findByUser(userId: string): RepoResult<IFavoriteCouponList>
};