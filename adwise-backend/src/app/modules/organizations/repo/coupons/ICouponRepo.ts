import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import {ICoupon} from '../../models/Coupon';

export interface ICouponRepo extends IRepo<ICoupon> {
    findByCategory(category: string): RepoResult<ICoupon[]>;
    findByOrganization(organizationId: string, limit: number, page: number, all?: boolean, type?: string, enabled?: boolean): RepoResult<ICoupon[]>;
    findExpiredCoupons(): RepoResult<ICoupon[]>;
    findStaringCoupons(): RepoResult<ICoupon[]>;
    findCouponsByIds(ids: string[], populate?: string): RepoResult<ICoupon[]>;
    searchCouponsByIds(ids: string[], search: string, limit: number, page: number): RepoResult<ICoupon[]>;
    setCouponsDisabledByOrganization(organizationId: string, disabled: boolean): RepoResult<any>;
    searchByIds(ids: string[], sortBy: string, order: number, populate?: string): RepoResult<ICoupon[]>;
    searchByIdsAndDisabled(ids: string[], disabled: boolean, sortBy: string, order: number, populate?: string): RepoResult<ICoupon[]>;
};