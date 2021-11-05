import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IHiddenCouponList } from "../../models/HiddenCouponList";

export interface IHiddenCouponListRepo extends IRepo<IHiddenCouponList> {
    findByUser(userId: string): RepoResult<IHiddenCouponList>
};