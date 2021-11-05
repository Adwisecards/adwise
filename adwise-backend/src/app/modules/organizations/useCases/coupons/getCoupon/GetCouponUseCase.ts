import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { GetCouponDTO } from "./GetCouponDTO";
import { getCouponErrors } from "./getCouponErrors";

export class GetCouponUseCase implements IUseCase<GetCouponDTO.Request, GetCouponDTO.Response> {
    private couponRepo: ICouponRepo;
    public errors: UseCaseError[] = [
        ...getCouponErrors
    ];
    constructor(couponRepo: ICouponRepo) {
        this.couponRepo = couponRepo;
    }

    public async execute(req: GetCouponDTO.Request): Promise<GetCouponDTO.Response> {
        if (!Types.ObjectId.isValid(req.couponId)) {
            return Result.fail(UseCaseError.create('c', 'Coupon ID must be valid'));
        }

        const couponFound = await this.couponRepo.findById(req.couponId);
        if (couponFound.isFailure) {
            return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const coupon = await couponFound.getValue()!.populate('offer').execPopulate();

        return Result.ok({coupon});
    }
}