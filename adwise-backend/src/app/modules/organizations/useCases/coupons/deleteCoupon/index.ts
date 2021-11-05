import { offerRepo } from "../../../../finance/repo/offers";
import { couponRepo } from "../../../repo/coupons";
import { organizationRepo } from "../../../repo/organizations";
import { DeleteCouponController } from "./DeleteCouponController";
import { DeleteCouponUseCase } from "./DeleteCouponUseCase";

const deleteCouponUseCase = new DeleteCouponUseCase(offerRepo, couponRepo, organizationRepo);
const deleteCouponController = new DeleteCouponController(deleteCouponUseCase);

export {
    deleteCouponUseCase,
    deleteCouponController
};