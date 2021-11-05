import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { HiddenCouponListModel, IHiddenCouponList } from "../../../models/HiddenCouponList";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IHiddenCouponListRepo } from "../../../repo/hiddenCouponLists/IHiddenCouponListRepo";
import { AddCouponToUserHiddenListDTO } from "./AddCouponToUserHiddenListDTO";
import { addCouponToUserHiddenListErrors } from "./addCouponToUserHiddenListErrors";

export class AddCouponToUserHiddenListUseCase implements IUseCase<AddCouponToUserHiddenListDTO.Request, AddCouponToUserHiddenListDTO.Response> {
    private hiddenCouponListRepo: IHiddenCouponListRepo;
    private couponRepo: ICouponRepo;

    public errors = addCouponToUserHiddenListErrors;

    constructor(hiddenCouponListRepo: IHiddenCouponListRepo, couponRepo: ICouponRepo) {
        this.hiddenCouponListRepo = hiddenCouponListRepo;
        this.couponRepo = couponRepo;
    }

    public async execute(req: AddCouponToUserHiddenListDTO.Request): Promise<AddCouponToUserHiddenListDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        if (!Types.ObjectId.isValid(req.couponId)) {
            return Result.fail(UseCaseError.create('c', 'couponId is not valid'));
        }

        let hiddenCouponList: IHiddenCouponList;

        const hiddenCouponListFound = await this.hiddenCouponListRepo.findByUser(req.userId);
        if (hiddenCouponListFound.isFailure && hiddenCouponListFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding hidden coupon list'));
        }

        if (hiddenCouponListFound.isFailure && hiddenCouponListFound.getError()!.code == 404) {
            const newHiddenCouponList = new HiddenCouponListModel({
                user: req.userId,
                coupons: []
            });

            hiddenCouponList = newHiddenCouponList;
        } else {
            hiddenCouponList = hiddenCouponListFound.getValue()!;
        }

        const hiddenCouponExists = !!hiddenCouponList!.coupons.find(c => c.toString() == req.couponId);
        if (hiddenCouponExists) {
            return Result.fail(UseCaseError.create('f', 'Coupon is already in list'));
        }

        const couponFound = await this.couponRepo.findById(req.couponId);
        if (couponFound.isFailure) {
            return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
        }

        const coupon = couponFound.getValue()!;

        hiddenCouponList.coupons.push(coupon._id);

        const hiddenCouponListSaved = await this.hiddenCouponListRepo.save(hiddenCouponList);
        if (hiddenCouponListSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving hidden coupon list'));
        }

        return Result.ok({couponId: req.couponId});
    }
}