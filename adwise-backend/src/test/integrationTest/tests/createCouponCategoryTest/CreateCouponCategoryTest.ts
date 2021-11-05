import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { ICouponCategory } from "../../../../app/modules/organizations/models/CouponCategory";
import { IOrganization } from "../../../../app/modules/organizations/models/Organization";
import { ICouponCategoryRepo } from "../../../../app/modules/organizations/repo/couponCategories/ICouponCategoryRepo";
import { CreateCouponCategoryDTO } from "../../../../app/modules/organizations/useCases/couponCategories/createCouponCategory/CreateCouponCategoryDTO";
import { CreateCouponCategoryUseCase } from "../../../../app/modules/organizations/useCases/couponCategories/createCouponCategory/CreateCouponCategoryUseCase";

interface ICreateCouponCategoryObjects {
    couponCategory: ICouponCategory;
};

export class CreateCouponCategoryTest {
    private couponCategoryRepo: ICouponCategoryRepo;
    private createCouponCategoryUseCase: CreateCouponCategoryUseCase;

    constructor(
        couponCategoryRepo: ICouponCategoryRepo,
        createCouponCategoryUseCase: CreateCouponCategoryUseCase
    ) {
        this.couponCategoryRepo = couponCategoryRepo;
        this.createCouponCategoryUseCase = createCouponCategoryUseCase;
    }

    public async execute(organization: IOrganization): Promise<Result<ICreateCouponCategoryObjects | null, UseCaseError | null>> {
        const couponCategoryData: CreateCouponCategoryDTO.Request = {
            name: 'coupon category',
            organizationId: organization._id.toString(),
            userId: organization.user.toString()
        };

        const couponCategoryCreated = await this.createCouponCategoryUseCase.execute(couponCategoryData);
        if (couponCategoryCreated.isFailure) {
            return Result.fail(couponCategoryCreated.getError());
        }

        const { couponCategoryId } = couponCategoryCreated.getValue()!;

        const couponCategoryFound = await this.couponCategoryRepo.findById(couponCategoryId);
        if (couponCategoryFound.isFailure) {
            return Result.fail(couponCategoryFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon category') : UseCaseError.create('b2'));
        }

        const couponCategory = couponCategoryFound.getValue()!;

        return Result.ok({couponCategory});
    }
}