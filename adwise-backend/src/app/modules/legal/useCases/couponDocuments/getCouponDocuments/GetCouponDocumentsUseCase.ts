import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { couponDocumentRepo } from "../../../repo/couponDocuments";
import { ICouponDocumentRepo } from "../../../repo/couponDocuments/ICouponDocumentRepo";
import { ICouponDocumentValidationService } from "../../../services/couponDocuments/couponDocuments/couponDocumentValidationService/ICouponDocumentValidationService";
import { GetCouponDocumentsDTO } from "./GetCouponDocumentsDTO";
import { getCouponDocumentsErrors } from "./getCouponDocumentsErrors";

export class GetCouponDocumentsUseCase implements IUseCase<GetCouponDocumentsDTO.Request, GetCouponDocumentsDTO.Response> {
    private couponRepo: ICouponRepo;
    private couponDocumentRepo: ICouponDocumentRepo;
    private couponDocumentValidationService: ICouponDocumentValidationService;

    public errors = getCouponDocumentsErrors;

    constructor(
        couponRepo: ICouponRepo,
        couponDocumentRepo: ICouponDocumentRepo,
        couponDocumentValidationService: ICouponDocumentValidationService
    ) {
        this.couponRepo = couponRepo;
        this.couponDocumentRepo = couponDocumentRepo;
        this.couponDocumentValidationService = couponDocumentValidationService;
    }

    public async execute(req: GetCouponDocumentsDTO.Request): Promise<GetCouponDocumentsDTO.Response> {
        const valid = this.couponDocumentValidationService.getCouponDocumentsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const couponFound = await this.couponRepo.findById(req.couponId);
        if (couponFound.isFailure) {
            return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
        }

        const coupon = couponFound.getValue()!;

        const couponDocumentsFound = await this.couponDocumentRepo.findManyByCoupon(req.couponId);
        if (couponDocumentsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding coupon documents'))
        }

        const couponDocuments = couponDocumentsFound.getValue()!;

        return Result.ok({couponDocuments});
    }
}