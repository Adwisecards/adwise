import { couponRepo } from "../../../../organizations/repo/coupons";
import { couponDocumentRepo } from "../../../repo/couponDocuments";
import { couponDocumentValidationService } from "../../../services/couponDocuments/couponDocuments/couponDocumentValidationService";
import { GetCouponDocumentsController } from "./GetCouponDocumentsController";
import { GetCouponDocumentsUseCase } from "./GetCouponDocumentsUseCase";

export const getCouponDocumentsUseCase = new GetCouponDocumentsUseCase(
    couponRepo,
    couponDocumentRepo,
    couponDocumentValidationService
);

export const getCouponDocumentsController = new GetCouponDocumentsController(getCouponDocumentsUseCase);