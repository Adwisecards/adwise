import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ICoupon } from "../../../models/Coupon";
import { ICouponCategory } from "../../../models/CouponCategory";
import { ICouponCategoryRepo } from "../../../repo/couponCategories/ICouponCategoryRepo";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { ICouponValidationService } from "../../../services/coupons/couponValidationService/ICouponValidationService";
import { SetCouponCategoriesDTO } from "./SetCouponCategoriesDTO";
import { setCouponCategoriesErrors } from "./setCouponCategoriesErrors";

interface IKeyObjects {
    coupon: ICoupon;
    couponCategories: ICouponCategory[];
    user: IUser;
};

export class SetCouponCategoriesUseCase implements IUseCase<SetCouponCategoriesDTO.Request, SetCouponCategoriesDTO.Response> {
    private userRepo: IUserRepo;
    private couponRepo: ICouponRepo;
    private couponCategoryRepo: ICouponCategoryRepo;
    private couponValidationService: ICouponValidationService;

    public errors = setCouponCategoriesErrors;

    constructor(
        userRepo: IUserRepo,
        couponRepo: ICouponRepo,
        couponCategoryRepo: ICouponCategoryRepo,
        couponValidationService: ICouponValidationService
    ) {
        this.userRepo = userRepo;
        this.couponRepo = couponRepo;
        this.couponCategoryRepo = couponCategoryRepo;
        this.couponValidationService = couponValidationService;
    }

    public async execute(req: SetCouponCategoriesDTO.Request): Promise<SetCouponCategoriesDTO.Response> {
        const valid = this.couponValidationService.setCouponCategoriesData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.couponId, req.couponCategoryIds);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            coupon,
            couponCategories,
            user
        } = keyObjectsGotten.getValue()!;

        if (coupon.organization.toString() != user.organization?.toString()) {
            return Result.fail(UseCaseError.create('d', 'Coupon is not of user organization'));
        }

        if (couponCategories.length && !!couponCategories.find(c => c.organization.toString() != coupon.organization.toString())) {
            return Result.fail(UseCaseError.create('d', 'Coupon category is not of organization'));
        }

        if (couponCategories.length && !!couponCategories.find(c => c.disabled)) {
            return Result.fail(UseCaseError.create('c', 'Coupon category is disabled'));
        }

        coupon.categories = couponCategories.map(c => c._id.toString());

        const couponSaved = await this.couponRepo.save(coupon);
        if (couponSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving coupon'));
        }

        return Result.ok({
            couponId: req.couponId
        });
    }

    private async getKeyObjects(userId: string, couponId: string, couponCategoryIds: string[]): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding user") : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const couponFound = await this.couponRepo.findById(couponId);
        if (couponFound.isFailure) {
            return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding coupon") : UseCaseError.create('q'));
        }

        const coupon = couponFound.getValue()!;

        const couponCategoriesFound = await this.couponCategoryRepo.findByIds(couponCategoryIds);
        if (couponCategoriesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', "Error upon finding coupon categories"));
        }

        const couponCategories = couponCategoriesFound.getValue()!;

        return Result.ok({
            coupon,
            couponCategories,
            user
        });
    }
}