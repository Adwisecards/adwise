import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContact } from "../../../../contacts/models/Contact";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { couponValidationService } from "../../../services/coupons/couponValidationService";
import { ICouponValidationService } from "../../../services/coupons/couponValidationService/ICouponValidationService";
import { FindCouponsDTO } from "./FindCouponsDTO";
import { findCouponsErrors } from "./findCouponsErrors";

export class FindCouponsUseCase implements IUseCase<FindCouponsDTO.Request, FindCouponsDTO.Response> {
    private userRepo: IUserRepo;
    private couponRepo: ICouponRepo;
    private couponValidationService: ICouponValidationService;

    public errors = [
        ...findCouponsErrors
    ];

    constructor(userRepo: IUserRepo, couponRepo: ICouponRepo, couponValidationService: ICouponValidationService) {
        this.userRepo = userRepo;
        this.couponRepo = couponRepo;
        this.couponValidationService = couponValidationService;
    }

    public async execute(req: FindCouponsDTO.Request): Promise<FindCouponsDTO.Response> {
        const valid = couponValidationService.findCouponsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = await userFound.getValue()!.populate('contacts').execPopulate();
        
        const contacts = (<any>user.contacts) as IContact[];
        const couponIds = [];

        for (const contact of contacts) {
            const contactCoupons = [];
            for (const coupon of contact.coupons) {
                contactCoupons.push(coupon.toString());
            }

            const couponsFound = await this.couponRepo.searchCouponsByIds(contactCoupons, req.search, req.limit, req.page);
            if (couponsFound.isSuccess) {
                const coupons = couponsFound.getValue()!;
                couponIds.push(...coupons);
            }
        }

        return Result.ok({coupons: couponIds});
    }
}