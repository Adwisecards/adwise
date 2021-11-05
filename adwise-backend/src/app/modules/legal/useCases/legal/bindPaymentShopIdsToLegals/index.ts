import { organizationRepo } from "../../../../organizations/repo/organizations";
import { legalRepo } from "../../../repo/legal";
import { BindPaymentShopIdsToLegalsUseCase } from "./BindPaymentShopIdsToLegalsUseCase";

export const bindPaymentShopIdsToLegalsUseCase = new BindPaymentShopIdsToLegalsUseCase(
    legalRepo,
    organizationRepo
);