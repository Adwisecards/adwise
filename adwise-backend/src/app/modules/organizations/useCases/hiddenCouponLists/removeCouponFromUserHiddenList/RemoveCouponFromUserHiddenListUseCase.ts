import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { HiddenCouponListModel } from "../../../models/HiddenCouponList";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IHiddenCouponListRepo } from "../../../repo/hiddenCouponLists/IHiddenCouponListRepo";
import { AddCouponToUserHiddenListDTO } from "../addCouponToUserHiddenList/AddCouponToUserHiddenListDTO";
import { RemoveCouponFromUserHiddenListDTO } from "./RemoveCouponFromUserHiddenListDTO";
import { removeCouponFromUserHiddenListErrors } from "./removeCouponFromUserHiddenListErrors";

export class RemoveCouponFromUserHiddenListUseCase implements IUseCase<RemoveCouponFromUserHiddenListDTO.Request, AddCouponToUserHiddenListDTO.Response> {
    private hiddenCouponListRepo: IHiddenCouponListRepo;
    private couponRepo: ICouponRepo;

    public errors = removeCouponFromUserHiddenListErrors;

    constructor(hiddenCouponListRepo: IHiddenCouponListRepo, couponRepo: ICouponRepo) {
        this.hiddenCouponListRepo = hiddenCouponListRepo;
        this.couponRepo = couponRepo;
    }

    public async execute(req: RemoveCouponFromUserHiddenListDTO.Request): Promise<RemoveCouponFromUserHiddenListDTO.Response> {
        if (!Types.ObjectId.isValid(req.couponId)) {
            return Result.fail(UseCaseError.create('c', 'couponId is not valid'));
        }

        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const hiddenCouponListFound = await this.hiddenCouponListRepo.findByUser(req.userId);
        if (hiddenCouponListFound.isFailure && hiddenCouponListFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', "error upon finding hiddenCouponList"));
        }

        if (hiddenCouponListFound.isFailure && hiddenCouponListFound.getError()!.code == 404) {
            const newHiddenCouponList = new HiddenCouponListModel({
                user: req.userId,
                coupons: []
            });

            const hiddenCouponListSaved = await this.hiddenCouponListRepo.save(newHiddenCouponList);
            if (hiddenCouponListSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', "error upon saving hidden coupon list"));
            }

            return Result.fail(UseCaseError.create('q', 'Coupon is not in list'));
        }

        const hiddenCouponList = hiddenCouponListFound.getValue()!;

        const couponIndex = hiddenCouponList.coupons.findIndex(c => c.toString() == req.couponId);
        if (couponIndex == -1) {
            return Result.fail(UseCaseError.create('q', 'Coupon is not in list'));
        }

        hiddenCouponList.coupons.splice(couponIndex, 1);

        const hiddenCouponListSaved = await this.hiddenCouponListRepo.save(hiddenCouponList);
        if (hiddenCouponListSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving hidden coupon list'));
        }

        return Result.ok({couponId: req.couponId});
    }
}