import { logger } from "../../../../../services/logger";
import { CouponValidationService } from "./implementation/CouponValidationService";

const couponValidationService = new CouponValidationService(logger);

export {
    couponValidationService
};