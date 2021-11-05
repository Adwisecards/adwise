import { xlsxService } from "../../../../../services/xlsxService";
import { couponRepo } from "../../../repo/coupons";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { GetOrganizationCouponsController } from "./GetOrganizationCouponsController";
import { GetOrganizationCouponsUseCase } from "./GetOrganizationCouponsUseCase";

const getOrganizationCouponsUseCase = new GetOrganizationCouponsUseCase(couponRepo, organizationValidationService, xlsxService);
const getOrganizationCouponsController = new GetOrganizationCouponsController(getOrganizationCouponsUseCase);

export {
    getOrganizationCouponsUseCase,
    getOrganizationCouponsController
};