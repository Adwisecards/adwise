import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { ICoupon } from "../../../models/Coupon";
import { GetCouponsByCategoryDTO } from "./GetCouponsByCategoryDTO";
import { getCouponsByCategoryErrors } from "./getCouponsByCategoryErrors";

export class GetCouponsByCategoryUseCase implements IUseCase<GetCouponsByCategoryDTO.Request, GetCouponsByCategoryDTO.Response> {
    private contactRepo: IContactRepo;
    public errors: UseCaseError[] = [
        ...getCouponsByCategoryErrors
    ];
    constructor(contactRepo: IContactRepo) {
        this.contactRepo = contactRepo;
    }

    public async execute(req: GetCouponsByCategoryDTO.Request): Promise<GetCouponsByCategoryDTO.Response> {
        if (!Types.ObjectId.isValid(req.contactId) || !req.category) {
            return Result.fail(UseCaseError.create('c', 'contact ID and category ID must be valid'));
        }

        const contactFound = await this.contactRepo.findById(req.contactId);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('w'));
        }

        let contact = contactFound.getValue()!;
        contact = await contact.populate('coupons').execPopulate();

        const coupons = (<any>contact.coupons) as ICoupon[];
        const categoryCoupons = coupons.filter(c => c.organizationCategory.toLowerCase() == req.category.toLowerCase());

        return Result.ok({coupons: categoryCoupons});
    }
}