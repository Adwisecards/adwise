import { mediaService } from "../../../../../services/mediaService";
import { offerRepo } from "../../../../finance/repo/offers";
import { addressRepo } from "../../../../maps/repo/addresses";
import { walletRepo } from "../../../../finance/repo/wallets";
import { mediaRepo } from "../../../../media/repo";
import { createRefUseCase } from "../../../../ref/useCases/createRef";
import { userRepo } from "../../../../users/repo/users";
import { couponRepo } from "../../../repo/coupons";
import { organizationRepo } from "../../../repo/organizations";
import { couponValidationService } from "../../../services/coupons/couponValidationService";
import { CreateCouponController } from "./CreateCouponController";
import { CreateCouponUseCase } from "./CreateCouponUseCase";
import { couponCategoryRepo } from "../../../repo/couponCategories";
import { generateCouponDocumentUseCase } from "../../../../legal/useCases/couponDocuments/generateCouponDocument";

const createCouponUseCase = new CreateCouponUseCase(
    offerRepo,
    couponRepo,
    organizationRepo,
    couponValidationService,
    mediaService,
    mediaRepo,
    createRefUseCase,
    addressRepo,
    userRepo,
    walletRepo,
    couponCategoryRepo,
    generateCouponDocumentUseCase
);
const createCouponController = new CreateCouponController(createCouponUseCase);

export {
    createCouponUseCase,
    createCouponController
};