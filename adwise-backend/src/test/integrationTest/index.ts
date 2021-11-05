import { database } from "../../app/services/database";
import { globalRepo } from "../../app/modules/administration/repo/globals";
import { setOrganizationGlobalUseCase } from "../../app/modules/administration/useCases/globals/setOrganizationGlobal";
import { contactRepo } from "../../app/modules/contacts/repo/contacts";
import { packetSoldRecordRepo } from "../../app/modules/finance/repo/packetSoldRecords";
import { paymentRepo } from "../../app/modules/finance/repo/payments";
import { purchaseRepo } from "../../app/modules/finance/repo/purchases";
import { subscriptionRepo } from "../../app/modules/finance/repo/subscriptions";
import { transactionRepo } from "../../app/modules/finance/repo/transactions";
import { walletRepo } from "../../app/modules/finance/repo/wallets";
import { handlePaymentStatusUseCase } from "../../app/modules/finance/useCases/payments/handlePaymentStatus";
import { calculatePurchaseMarketingUseCase } from "../../app/modules/finance/useCases/purchases/calculatePurchaseMarketing";
import { confirmPurchaseUseCase } from "../../app/modules/finance/useCases/purchases/confirmPurchase";
import { createPurchaseUseCase } from "../../app/modules/finance/useCases/purchases/createPurchase";
import { payPurchaseUseCase } from "../../app/modules/finance/useCases/purchases/payPurchase";
import { payPurchaseWithCashUseCase } from "../../app/modules/finance/useCases/purchases/payPurchaseWithCash";
import { legalRepo } from "../../app/modules/legal/repo/legal";
import { createLegalUseCase } from "../../app/modules/legal/useCases/legal/createLegal";
import { createAddressFromCoordsUseCase } from "../../app/modules/maps/useCases/addresses/createAddressFromCoords";
import { createMediaUseCase } from "../../app/modules/media/useCases/createMedia";
import { categoryRepo } from "../../app/modules/organizations/repo/categories";
import { clientRepo } from "../../app/modules/organizations/repo/clients";
import { couponCategoryRepo } from "../../app/modules/organizations/repo/couponCategories";
import { couponRepo } from "../../app/modules/organizations/repo/coupons";
import { employeeRepo } from "../../app/modules/organizations/repo/employees";
import { organizationRepo } from "../../app/modules/organizations/repo/organizations";
import { packetRepo } from "../../app/modules/organizations/repo/packets";
import { createCategoryUseCase } from "../../app/modules/organizations/useCases/categories/createCategory";
import { createCouponCategoryUseCase } from "../../app/modules/organizations/useCases/couponCategories/createCouponCategory";
import { addCouponToContactUseCase } from "../../app/modules/organizations/useCases/coupons/addCouponToContact";
import { createCouponUseCase } from "../../app/modules/organizations/useCases/coupons/createCoupon";
import { setCouponDisabledUseCase } from "../../app/modules/organizations/useCases/coupons/setCouponDisabled";
import { createOrganizationUseCase } from "../../app/modules/organizations/useCases/organizations/createOrganization";
import { setManagerUseCase } from "../../app/modules/organizations/useCases/organizations/setManager";
import { subscribeToOrganizationUseCase } from "../../app/modules/organizations/useCases/organizations/subscribeToOrganization";
import { updateOrganizationStatisticsUseCase } from "../../app/modules/organizations/useCases/organizationStatistics/updateOrganizationStatistics";
import { addPacketToOrganizationUseCase } from "../../app/modules/organizations/useCases/packets/addPacketToOrganization";
import { createPacketUseCase } from "../../app/modules/organizations/useCases/packets/createPacket";
import { setOrganizationPacketUseCase } from "../../app/modules/organizations/useCases/packets/setOrganizationPacket";
import { userRepo } from "../../app/modules/users/repo/users";
import { updateUserFinancialStatisticsUseCase } from "../../app/modules/users/useCases/userFinancialStatistics/updateUserFinancialStatistics";
import { createUserUseCase } from "../../app/modules/users/useCases/users/createUser";
import { paymentService } from "../../app/services/paymentService";
import { IntegrationTest } from "./IntegrationTest";
import { createGlobalTest } from "./tests/createGlobalTest";
import { createUsersTest } from "./tests/createUsersTest";
import { createCategoryTest } from "./tests/createCategoryTest";
import { createPacketTest } from './tests/createPacketTest';
import { createOrganizationTest } from "./tests/createOrganizationTest";
import { setOrganizationPacketTest } from "./tests/setOrganizationPacketTest";
import { subscribeToOrganizationTest } from "./tests/subscribeToOrganizationTest";
import { createPurchasesTest } from "./tests/createPurchasesTest";
import { payPurchasesTest } from "./tests/payPurchasesTest";
import { handlePaymentStatusTest } from "./tests/handlePaymentStatusTest";
import { createCouponsTest } from "./tests/createCouponsTest";
import { createAddressTest } from "./tests/createAddressTest";
import { setOrganizationTest } from "./tests/setOrganizationTest";
import { createCouponCategoryTest } from "./tests/createCouponCategoryTest";

export const integrationTest = new IntegrationTest(
    database,
    createGlobalTest,
    createUsersTest,
    createCategoryTest,
    createAddressTest,
    createPacketTest,
    createOrganizationTest,
    setOrganizationTest,
    setOrganizationPacketTest,
    subscribeToOrganizationTest,
    createCouponCategoryTest,
    createCouponsTest,
    createPurchasesTest,
    payPurchasesTest,
    handlePaymentStatusTest
);