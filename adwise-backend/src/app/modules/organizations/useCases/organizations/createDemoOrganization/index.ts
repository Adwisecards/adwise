import { purchaseRepo } from "../../../../finance/repo/purchases";
import { confirmPurchaseUseCase } from "../../../../finance/useCases/purchases/confirmPurchase";
import { createPurchaseUseCase } from "../../../../finance/useCases/purchases/createPurchase";
import { userRepo } from "../../../../users/repo/users";
import { createUserUseCase } from "../../../../users/useCases/users/createUser";
import { couponRepo } from "../../../repo/coupons";
import { organizationRepo } from "../../../repo/organizations";
import { createCategoryUseCase } from "../../categories/createCategory";
import { addCouponToContactUseCase } from "../../coupons/addCouponToContact";
import { createCouponUseCase } from "../../coupons/createCoupon";
import { subscribeToOrganizationUseCase } from "../subscribeToOrganization";
import { CreateDemoOrganizationUseCase } from "./CreateDemoOrganizationUseCase";
import { createOrganizationUseCase } from '../createOrganization';
import { packetRepo } from "../../../repo/packets";
import { setOrganizationPacketUseCase } from "../../packets/setOrganizationPacket";
import { setManagerUseCase } from "../setManager";
import { setCouponDisabledUseCase } from "../../coupons/setCouponDisabled";
import { updateOrganizationStatisticsUseCase } from "../../organizationStatistics/updateOrganizationStatistics";
import { createPacketUseCase } from "../../packets/createPacket";
import { setOrganizationGlobalUseCase } from "../../../../administration/useCases/globals/setOrganizationGlobal";
import { createMediaUseCase } from "../../../../media/useCases/createMedia";
import { createAddressFromCoordsUseCase } from "../../../../maps/useCases/addresses/createAddressFromCoords";
import { createCouponCategoryUseCase } from "../../couponCategories/createCouponCategory";

export const createDemoOrganizationUseCase = new CreateDemoOrganizationUseCase(
    userRepo,
    couponRepo,
    packetRepo,
    purchaseRepo,
    organizationRepo,
    setManagerUseCase,
    createUserUseCase,
    createMediaUseCase,
    createPacketUseCase,
    createCouponUseCase,
    createCategoryUseCase,
    createPurchaseUseCase,
    confirmPurchaseUseCase,
    setCouponDisabledUseCase,
    addCouponToContactUseCase,
    createOrganizationUseCase,
    createCouponCategoryUseCase,
    setOrganizationGlobalUseCase,
    setOrganizationPacketUseCase,
    subscribeToOrganizationUseCase,
    createAddressFromCoordsUseCase,
    updateOrganizationStatisticsUseCase
);