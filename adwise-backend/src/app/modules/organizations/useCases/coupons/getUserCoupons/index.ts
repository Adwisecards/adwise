import { contactRepo } from "../../../../contacts/repo/contacts";
import { userRepo } from "../../../../users/repo/users";
import { couponRepo } from "../../../repo/coupons";
import { couponValidationService } from "../../../services/coupons/couponValidationService";
import { getUserHiddenCouponsUseCase } from "../../hiddenCouponLists/getUserHiddenCoupons";
import { GetUserCouponsController } from "./GetUserCouponsController";
import { GetUserCouponsUseCase } from "./GetUserCouponsUseCase";

const getUserCouponsUseCase = new GetUserCouponsUseCase(
    userRepo,
    couponRepo,
    contactRepo, 
    couponValidationService,
    getUserHiddenCouponsUseCase
);
const getUserCouponsController = new GetUserCouponsController(getUserCouponsUseCase);

export {
    getUserCouponsUseCase,
    getUserCouponsController
};