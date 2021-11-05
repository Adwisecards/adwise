import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOfferRepo } from "../../../../finance/repo/offers/IOfferRepo";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { DeleteCouponDTO } from "./DeleteCouponDTO";
import { deleteCouponErrors } from "./deleteCouponErrors";

export class DeleteCouponUseCase implements IUseCase<DeleteCouponDTO.Request, DeleteCouponDTO.Response> {
    private offerRepo: IOfferRepo;
    private couponRepo: ICouponRepo;
    private organizationRepo: IOrganizationRepo;
    public errors: UseCaseError[] = [
        ...deleteCouponErrors
    ];

    constructor(offerRepo: IOfferRepo, couponRepo: ICouponRepo, organizationRepo: IOrganizationRepo) {
        this.offerRepo = offerRepo;
        this.couponRepo = couponRepo;
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: DeleteCouponDTO.Request): Promise<DeleteCouponDTO.Response> {
        if (!Types.ObjectId.isValid(req.couponId)) {
            return Result.fail(UseCaseError.create('c', 'Coupon id must be valid'));
        }

        const couponFound = await this.couponRepo.findById(req.couponId);
        if (couponFound.isFailure) {
            return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const coupon = couponFound.getValue()!;
        
        const organizationFound = await this.organizationRepo.findById(coupon.organization.toHexString());
        if (organizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization'));
        }

        const organization = organizationFound.getValue()!;

        const couponIndex = organization.coupons.findIndex(i => i.toHexString() == coupon._id);
        if (couponIndex >= 0) {
            organization.coupons.splice(couponIndex, 1);
        }

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        const couponDeleted = await this.couponRepo.deleteById(req.couponId);
        if (couponDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting coupons'));
        }

        await this.offerRepo.deleteById(coupon.offer.toHexString());

        return Result.ok({couponId: req.couponId});
    }
}