import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { HiddenCouponListModel } from "../../../models/HiddenCouponList";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IHiddenCouponListRepo } from "../../../repo/hiddenCouponLists/IHiddenCouponListRepo";
import { GetUserHiddenCouponsDTO } from "./GetUserHiddenCouponsDTO";
import { getUserHiddenCouponsErrors } from "./getUserHiddenCouponsErrors";

export class GetUserHiddenCouponsUseCase implements IUseCase<GetUserHiddenCouponsDTO.Request, GetUserHiddenCouponsDTO.Response> {
    private hiddenCouponListRepo: IHiddenCouponListRepo;
    private couponRepo: ICouponRepo;

    public errors = getUserHiddenCouponsErrors;

    constructor(hiddenCouponListRepo: IHiddenCouponListRepo, couponRepo: ICouponRepo) {
        this.hiddenCouponListRepo = hiddenCouponListRepo;
        this.couponRepo = couponRepo;
    }

    public async execute(req: GetUserHiddenCouponsDTO.Request): Promise<GetUserHiddenCouponsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const hiddenCouponListFound = await this.hiddenCouponListRepo.findByUser(req.userId);
        if (hiddenCouponListFound.isFailure && hiddenCouponListFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user hidden coupons'));
        }

        if (hiddenCouponListFound.isFailure && hiddenCouponListFound.getError()!.code == 404) {
            const hiddenCouponList = new HiddenCouponListModel({
                user: req.userId,
                coupons: []
            });

            const hiddenCouponListSaved = await this.hiddenCouponListRepo.save(hiddenCouponList);
            if (hiddenCouponListSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving hidden coupon list'));
            }

            return Result.ok({coupons: []});
        }

        const hiddenCouponList = hiddenCouponListFound.getValue()!;

        if (!hiddenCouponList.coupons.length) {
            return Result.ok({coupons: []});
        }

        const couponIds = hiddenCouponList.coupons.map(c => c.toString());

        const couponsFound = await this.couponRepo.searchByIdsAndDisabled(couponIds, false, '_id', -1, 'organization offer');
        if (couponsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding coupons'));
        }

        const coupons = couponsFound.getValue()!;

        return Result.ok({coupons});
    }
}