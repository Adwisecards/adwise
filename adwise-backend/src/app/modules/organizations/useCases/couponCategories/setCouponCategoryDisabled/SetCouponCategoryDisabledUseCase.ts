import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ICouponCategoryRepo } from "../../../repo/couponCategories/ICouponCategoryRepo";
import { ICouponCategoryValidationService } from "../../../services/couponCategories/couponCategoryValidationService/ICouponCategoryValidationService";
import { SetCouponCategoryDisabledDTO } from "./SetCouponCategoryDisabledDTO";
import { setCouponCategoryDisabledErrors } from "./setCouponCategoryDisabledErrors";

export class SetCouponCategoryDisabledUseCase implements IUseCase<SetCouponCategoryDisabledDTO.Request, SetCouponCategoryDisabledDTO.Response> {
    private userRepo: IUserRepo;
    private couponCategoryRepo: ICouponCategoryRepo;
    private couponCategoryValidationService: ICouponCategoryValidationService;

    public errors = setCouponCategoryDisabledErrors;

    constructor(
        userRepo: IUserRepo,
        couponCategoryRepo: ICouponCategoryRepo,
        couponCategoryValidationService: ICouponCategoryValidationService
    ) {
        this.userRepo = userRepo;
        this.couponCategoryRepo = couponCategoryRepo;
        this.couponCategoryValidationService = couponCategoryValidationService;
    }

    public async execute(req: SetCouponCategoryDisabledDTO.Request): Promise<SetCouponCategoryDisabledDTO.Response> {
        const valid = this.couponCategoryValidationService.setCouponCategoryDisabledData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const couponCategoryFound = await this.couponCategoryRepo.findById(req.couponCategoryId);
        if (couponCategoryFound.isFailure) {
            return Result.fail(couponCategoryFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon category') : UseCaseError.create('b2'));
        }

        const couponCategory = couponCategoryFound.getValue()!;

        if (couponCategory.organization.toString()! != user.organization?.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        couponCategory.disabled = req.disabled;

        const couponCategorySaved = await this.couponCategoryRepo.save(couponCategory);
        if (couponCategorySaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving coupon category'));
        }

        return Result.ok({
            couponCategoryId: req.couponCategoryId
        });
    }
}