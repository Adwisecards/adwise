import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { ICoupon } from "../../../models/Coupon";
import { GetCategoryCouponsDTO, ICategoryCoupons } from "./GetCategoryCouponsDTO";
import { getCategoryCouponsErrors } from "./getCategoryCouponsErrors";

export class GetCategoryCouponsUseCase implements IUseCase<GetCategoryCouponsDTO.Request, GetCategoryCouponsDTO.Response> {
    private contactRepo: IContactRepo;
    public errors: UseCaseError[] = [
        ...getCategoryCouponsErrors
    ];
    constructor(contactRepo: IContactRepo) {
        this.contactRepo = contactRepo;
    }

    public async execute(req: GetCategoryCouponsDTO.Request): Promise<GetCategoryCouponsDTO.Response> {
        const categoryCouponCollection: ICategoryCoupons[] = [];

        const contactFound = await this.contactRepo.findById(req.contactId);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('w'));
        }

        let contact = contactFound.getValue()!;
        contact = await contact.populate('coupons').execPopulate();

        const coupons: ICoupon[] = (<any>contact.coupons) as ICoupon[];

        const populatedCoupons: ICoupon[] = [];
        for (const coupon of coupons) {
            populatedCoupons.push(await coupon.populate('offer').populate('organization', 'picture mainPicture name description briefDescription colors').execPopulate());
        }

        const categories = populatedCoupons.map(c => c.organizationCategory);
        const uniqueCategories = [];
        const m = {};
        for (const category of categories) {
            if ((<any>m)[category]) {
                continue;
            } else {
                (<any>m)[category] = true;
                uniqueCategories.push(category);
            }
        }

        for (const category of uniqueCategories) {
            const categoryCoupons = populatedCoupons.filter(c => c.organizationCategory == category)
            categoryCouponCollection.push({
                category: category,
                categoryCoupons: categoryCoupons
            });
        }

        return Result.ok({categoryCoupons: categoryCouponCollection});
    }
}