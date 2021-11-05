import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICouponCategoryRepo } from "../../../repo/couponCategories/ICouponCategoryRepo";
import { ICouponCategoryValidationService } from "../../../services/couponCategories/couponCategoryValidationService/ICouponCategoryValidationService";
import { GetOrganizationCouponCategoriesDTO } from "./GetOrganizationCouponCategoriesDTO";
import { getOrganizationCouponCategoriesErrors } from "./getOrganizationCouponCategoriesErrors";

export class GetOrganizationCouponCategoriesUseCase implements IUseCase<GetOrganizationCouponCategoriesDTO.Request, GetOrganizationCouponCategoriesDTO.Response> {
    private couponCategoryRepo: ICouponCategoryRepo;
    private couponCategoryValidationService: ICouponCategoryValidationService;

    public errors = getOrganizationCouponCategoriesErrors;

    constructor(
        couponCategoryRepo: ICouponCategoryRepo,
        couponCategoryValidationService: ICouponCategoryValidationService
    ) {
        this.couponCategoryRepo = couponCategoryRepo;
        this.couponCategoryValidationService = couponCategoryValidationService;
    }

    public async execute(req: GetOrganizationCouponCategoriesDTO.Request): Promise<GetOrganizationCouponCategoriesDTO.Response> {
        const valid = this.couponCategoryValidationService.getOrganizationCouponCategoriesData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const couponCategoriesFound = await this.couponCategoryRepo.findManyByOrganizationAndDisabled(req.organizationId, req.disabled);
        if (couponCategoriesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', "Error upon finding coupon categories"));
        }

        const couponCategories = couponCategoriesFound.getValue()!;

        return Result.ok({couponCategories});
    }
}