import { userRepo } from "../../../../users/repo/users";
import { couponRepo } from "../../../repo/coupons";
import { couponValidationService } from "../../../services/coupons/couponValidationService";
import { FindCouponsController } from "./FindCouponsController";
import { FindCouponsUseCase } from "./FindCouponsUseCase";

const findCouponsUseCase = new FindCouponsUseCase(userRepo, couponRepo, couponValidationService);
const findCouponsController = new FindCouponsController(findCouponsUseCase);

export {
    findCouponsUseCase,
    findCouponsController
};