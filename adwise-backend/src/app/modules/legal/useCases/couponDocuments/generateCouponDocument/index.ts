import { mediaService } from "../../../../../services/mediaService";
import { pdfService } from "../../../../../services/pdfService";
import { offerRepo } from "../../../../finance/repo/offers";
import { mediaRepo } from "../../../../media/repo";
import { createMediaUseCase } from "../../../../media/useCases/createMedia";
import { couponRepo } from "../../../../organizations/repo/coupons";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { couponDocumentRepo } from "../../../repo/couponDocuments";
import { legalRepo } from "../../../repo/legal";
import { couponDocumentValidationService } from "../../../services/couponDocuments/couponDocuments/couponDocumentValidationService";
import { GenerateCouponDocumentUseCase } from "./GenerateCouponDocumentUseCase";

export const generateCouponDocumentUseCase = new GenerateCouponDocumentUseCase(
    userRepo,
    offerRepo,
    mediaRepo,
    legalRepo,
    couponRepo,
    pdfService,
    mediaService,
    organizationRepo,
    createMediaUseCase,
    couponDocumentRepo,
    couponDocumentValidationService
);