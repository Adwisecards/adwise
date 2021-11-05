import { boolean } from "joi";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { ICoupon, ICouponModel } from "../../../models/Coupon";
import { ICouponRepo } from "../ICouponRepo";

export class CouponRepo extends Repo<ICoupon, ICouponModel> implements ICouponRepo {
    public async findByCategory(category: string) {
        try {
            const coupons = await this.Model.find({organizationCategory: category}).limit(2);
            return Result.ok(coupons);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByOrganization(organizationId: string, limit: number, page: number, all?: boolean, type?: string, disabled?: boolean) {
        try {
            const query: any = {
                organization: organizationId,
                disabled: false
            };

            if (all) {
                delete query.disabled;
            }

            if (disabled) {
                query.disabled = true;
            }

            if (type) {
                query.type = type;
            }

            const coupons = await this.Model.find(query)
                .sort({index: -1})
                .limit(limit)
                .skip(limit * (page - 1));

            return Result.ok(coupons);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findExpiredCoupons() {
        try {
            const coupons = await this.Model.find({
                endDate: {$lt: new Date()}
            });

            return Result.ok(coupons);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findStaringCoupons() {
        try {
            const coupons = await this.Model.find({
                startDate: {$gt: new Date()}
            });

            return Result.ok(coupons);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findCouponsByIds(ids: string[], populate?: string) {
        try {
            const coupons = await this.Model.find({
                _id: {$in: ids}
            }).populate(populate);

            return Result.ok(coupons);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async searchCouponsByIds(ids: string[], search: string, limit: number, page: number) {
        try {
            const pattern = new RegExp(`.*${search}.*`);
            
            const coupons = await this.Model.find({
                _id: {$in: ids},
                $or: [
                    {
                        name: {$regex: pattern},
                    },
                    {
                        organizationName: {$regex: pattern}
                    },
                    {
                        organizationCategory: {$regex: pattern}
                    },
                    {
                        description: {$regex: pattern}
                    }
                ]
            }).limit(limit).skip((page - 1) * limit).sort({index: -1}).populate('organization offer');

            return Result.ok(coupons);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async setCouponsDisabledByOrganization(organizationId: string, disabled: boolean) {
        try {
            const result = await this.Model.updateMany({organization: organizationId}, {$set: {disabled: disabled}});

            return Result.ok(result);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async searchByIds(ids: string[], sortBy: string, order: number, populate?: string) {
        try {
            const coupons = await this.Model.find({_id: {$in: ids}}).sort({[sortBy]: order}).populate(populate);

            return Result.ok(coupons);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async searchByIdsAndDisabled(ids: string[], disabled: boolean, sortBy: string, order: number, populate?: string) {
        try {
            const coupons = await this.Model.find({_id: {$in: ids}, disabled: disabled}).sort({[sortBy]: order}).populate(populate);

            return Result.ok(coupons);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}