import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { CouponCategoryModel, ICouponCategory } from "../../../models/CouponCategory";
import { IOrganization } from "../../../models/Organization";
import { ICouponCategoryRepo } from "../../../repo/couponCategories/ICouponCategoryRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { ICouponCategoryValidationService } from "../../../services/couponCategories/couponCategoryValidationService/ICouponCategoryValidationService";
import { CreateCouponCategoryDTO } from "./CreateCouponCategoryDTO";
import { createCouponCategoryErrors } from "./createCouponCategoryErrors";

interface IKeyObjects {
    user: IUser;
    organization: IOrganization;
    couponCategory?: ICouponCategory;
};

export class CreateCouponCategoryUseCase implements IUseCase<CreateCouponCategoryDTO.Request, CreateCouponCategoryDTO.Response> {
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private couponCategoryRepo: ICouponCategoryRepo;
    private couponCategoryValidationService: ICouponCategoryValidationService;

    public errors = createCouponCategoryErrors;

    constructor(
        userRepo: IUserRepo,
        organizationRepo: IOrganizationRepo,
        couponCategoryRepo: ICouponCategoryRepo,
        couponCategoryValidationService: ICouponCategoryValidationService
    ) {
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.couponCategoryRepo = couponCategoryRepo;
        this.couponCategoryValidationService = couponCategoryValidationService;
    }

    public async execute(req: CreateCouponCategoryDTO.Request): Promise<CreateCouponCategoryDTO.Response> {
        const valid = this.couponCategoryValidationService.createCouponCategoryData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }
        
        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.organizationId, req.name);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            organization,
            user,
            couponCategory: couponCategoryExists
        } = keyObjectsGotten.getValue()!;

        if (organization.user.toString() != user._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        if (couponCategoryExists) {
            return Result.fail(UseCaseError.create('f', 'Coupon category already exists'));
        }

        const couponCategory = new CouponCategoryModel({
            name: req.name.toLowerCase(),
            organization: req.organizationId
        });

        const couponCategorySaved = await this.couponCategoryRepo.save(couponCategory);
        if (couponCategorySaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving coupon category'));
        }

        return Result.ok({couponCategoryId: couponCategory._id.toString()});
    }

    public async getKeyObjects(userId: string, organizationId: string, couponCategoryName: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        
        let couponCategory: ICouponCategory | undefined;

        const couponCategoryFound = await this.couponCategoryRepo.findByNameAndOrganization(couponCategoryName, organizationId);
        if (couponCategoryFound.isSuccess) {
            couponCategory = couponCategoryFound.getValue()!;
        }

        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        return Result.ok({
            organization,
            user,
            couponCategory
        });
    }
}