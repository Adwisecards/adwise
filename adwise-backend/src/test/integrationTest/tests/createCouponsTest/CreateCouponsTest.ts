import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { ICoupon } from "../../../../app/modules/organizations/models/Coupon";
import { ICouponCategory } from "../../../../app/modules/organizations/models/CouponCategory";
import { IOrganization } from "../../../../app/modules/organizations/models/Organization";
import { ICouponRepo } from "../../../../app/modules/organizations/repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../../app/modules/organizations/repo/organizations/IOrganizationRepo";
import { CreateCouponDTO } from "../../../../app/modules/organizations/useCases/coupons/createCoupon/CreateCouponDTO";
import { CreateCouponUseCase } from "../../../../app/modules/organizations/useCases/coupons/createCoupon/CreateCouponUseCase";

interface ICreateCouponsObjects {
    coupons: ICoupon[];
    organization: IOrganization;
};

export class CreateCouponsTest {
    private couponRepo: ICouponRepo;
    private organizationRepo: IOrganizationRepo;
    private createCouponUseCase: CreateCouponUseCase;

    constructor(
        couponRepo: ICouponRepo,
        organizationRepo: IOrganizationRepo,
        createCouponUseCase: CreateCouponUseCase
    ) {
        this.couponRepo = couponRepo;
        this.organizationRepo = organizationRepo;
        this.createCouponUseCase = createCouponUseCase;
    }

    public async execute(organization: IOrganization, couponCategory: ICouponCategory): Promise<Result<ICreateCouponsObjects | null, UseCaseError | null>> {
        const createCouponsData: CreateCouponDTO.Request[] = [{
            description: 'description1',
            index: 0,
            couponCategoryIds: [couponCategory._id.toString()],
            organizationId: organization._id.toString(),
            distributionSchema: {
                first: 10,
                other: 20
            },
            name: 'coupon1',
            documentMediaId: undefined as any,
            endDate: undefined as any,
            locationAddressId: organization.address._id.toString(),
            offerPercent: 10,
            offerPoints: undefined as any,
            offerType: 'cashback',
            pictureMediaId: undefined as any,
            price: 100,
            quantity: 100,
            startDate: new Date().toISOString(),
            termsDocumentMediaId: undefined as any,
            ageRestricted: undefined as any,
            userId: organization.user.toString(),
            type: 'service',
            disabled: false,
            floating: false
        }, {
            description: 'description2',
            index: 0,
            couponCategoryIds: undefined as any,
            organizationId: organization._id.toString(),
            distributionSchema: {
                first: 10,
                other: 20
            },
            name: 'coupon2',
            documentMediaId: undefined as any,
            endDate: undefined as any,
            locationAddressId: organization.address._id.toString(),
            offerPercent: 10,
            offerPoints: undefined as any,
            offerType: 'cashback',
            pictureMediaId: undefined as any,
            price: 200,
            quantity: 100,
            startDate: new Date().toISOString(),
            termsDocumentMediaId: undefined as any,
            ageRestricted: undefined as any,
            userId: organization.user.toString(),
            type: 'service',
            disabled: false,
            floating: false
        }];

        const coupons: ICoupon[] = [];

        for (const couponData of createCouponsData) {
            const couponCreated = await this.createCouponUseCase.execute(couponData);
            if (couponCreated.isFailure) {
                return Result.fail(couponCreated.getError());
            }

            const { couponId } = couponCreated.getValue()!;

            const couponFound = await this.couponRepo.findById(couponId);
            if (couponFound.isFailure) {
                return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q', 'Coupon does not exist'));
            }

            const coupon = couponFound.getValue()!;

            coupons.push(coupon);
        }

        const organizationFound = await this.organizationRepo.findById(organization._id.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l', 'Organization does not exist'));
        }

        organization = organizationFound.getValue()!;

        if (organization.coupons.length != 2) {
            return Result.fail(UseCaseError.create('c', 'Organization coupons length is incorrect'));
        } 

        return Result.ok({coupons, organization});
    }
}