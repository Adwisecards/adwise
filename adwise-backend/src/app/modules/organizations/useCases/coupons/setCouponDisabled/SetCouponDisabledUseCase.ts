import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { SetCouponDisabledDTO } from "./SetCouponDisabledDTO";
import { setCouponDisabledErrors } from "./setCouponDisabledErrors";

export class SetCouponDisabledUseCase implements IUseCase<SetCouponDisabledDTO.Request, SetCouponDisabledDTO.Response> {
    private couponRepo: ICouponRepo;
    public errors: UseCaseError[] = [
        ...setCouponDisabledErrors
    ];

    constructor(couponRepo: ICouponRepo) {
        this.couponRepo = couponRepo;
    }

    public async execute(req: SetCouponDisabledDTO.Request): Promise<SetCouponDisabledDTO.Response> {
        if (!Types.ObjectId.isValid(req.couponId) || typeof req.disabled != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'Either couponId or disabled is not valid'));
        }

        const couponFound = await this.couponRepo.findById(req.couponId);
        if (couponFound.isFailure) {
            return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('q'));
        }

        const coupon = couponFound.getValue()!;
        coupon.disabled = req.disabled;

        const couponSaved = await this.couponRepo.save(coupon);
        if (couponSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving coupon'));
        }

        return Result.ok({couponId: req.couponId});
    }
}