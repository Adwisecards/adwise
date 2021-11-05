import { couponRepo } from "../../../../app/modules/organizations/repo/coupons";
import { organizationRepo } from "../../../../app/modules/organizations/repo/organizations";
import { createCouponUseCase } from "../../../../app/modules/organizations/useCases/coupons/createCoupon";
import { CreateCouponsTest } from "./CreateCouponsTest";

export const createCouponsTest = new CreateCouponsTest(
    couponRepo,
    organizationRepo,
    createCouponUseCase
);