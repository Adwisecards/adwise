import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { CreateOrganizationNotificationUseCase } from "../../organizationNotifications/createOrganizationNotification/CreateOrganizationNotificationUseCase";

export class CheckCouponUseCase implements IUseCase<any, any> {
    private couponRepo: ICouponRepo;
    private createOrganizationNotificationUseCase: CreateOrganizationNotificationUseCase;
    
    public errors = [];

    constructor(
        couponRepo: ICouponRepo,
        createOrganizationNotificationUseCase: CreateOrganizationNotificationUseCase
    ) {
        this.couponRepo = couponRepo;
        this.createOrganizationNotificationUseCase = createOrganizationNotificationUseCase;
    }

    public async execute(_: any): Promise<any> {
        const expiredCouponsFound = await this.couponRepo.findExpiredCoupons();
        if (expiredCouponsFound.isFailure) {
            return Result.fail(null);
        }

        const expiredCoupons = expiredCouponsFound.getValue()!;

        for (const expiredCoupon of expiredCoupons) {
            if (!expiredCoupon.disabled) {
                await this.createOrganizationNotificationUseCase.execute({
                    organizationId: expiredCoupon.organization.toString(),
                    couponId: expiredCoupon._id.toString(),
                    type: 'couponExpired'
                });
            }

            expiredCoupon.disabled = true;
            await this.couponRepo.save(expiredCoupon);

        }

        const startingCouponsFound = await this.couponRepo.findStaringCoupons();
        if (startingCouponsFound.isFailure) {
            return Result.fail(null);
        }

        const startingCoupons = startingCouponsFound.getValue()!;

        for (const startingCoupon of startingCoupons) {
            startingCoupon.disabled = false;
            await this.couponRepo.save(startingCoupon);
        }

        return Result.ok({});
    }
}