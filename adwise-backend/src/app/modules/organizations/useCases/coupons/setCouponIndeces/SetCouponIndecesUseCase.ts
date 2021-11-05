import { model } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { SetCouponIndecesDTO } from "./SetCouponIndecesDTO";
import { setCouponIndecesErrors } from "./setCouponIndecesErrors";

export class SetCouponIndecesUseCase implements IUseCase<SetCouponIndecesDTO.Request, SetCouponIndecesDTO.Response> {
    private couponRepo: ICouponRepo;

    public errors = [
        ...setCouponIndecesErrors
    ];

    constructor(couponRepo: ICouponRepo) {
        this.couponRepo = couponRepo;
    }

    public async execute(req: SetCouponIndecesDTO.Request): Promise<SetCouponIndecesDTO.Response> {
        const couponsFound = await this.couponRepo.findCouponsByIds(Object.keys(req.coupons));
        if (couponsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding coupons'));
        }

        const coupons = couponsFound.getValue()!;
        
        const ids: string[] = [];
        for (const coupon of coupons) {
            if (!req.coupons[coupon._id.toString()]) continue;

            coupon.index = req.coupons[coupon._id.toString()];

            const couponSaved = await this.couponRepo.save(coupon);
            if (couponSaved.isFailure) continue;

        }

        return Result.ok({ids});
    }
}