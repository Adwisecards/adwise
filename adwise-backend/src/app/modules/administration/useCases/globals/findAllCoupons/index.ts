import { couponRepo } from "../../../../organizations/repo/coupons";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllCouponsController } from "./FindAllCouponsController";
import { FindAllCouponsUseCase } from "./FindAllCouponsUseCase";

const findAllCouponsUseCase = new FindAllCouponsUseCase(couponRepo, administrationValidationService);
const findAllCouponsController = new FindAllCouponsController(findAllCouponsUseCase);

export {
    findAllCouponsUseCase,
    findAllCouponsController
};