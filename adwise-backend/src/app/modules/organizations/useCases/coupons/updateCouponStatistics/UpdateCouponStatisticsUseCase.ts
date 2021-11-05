import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../models/Coupon";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IOrganizationStatisticsService } from "../../../services/organizations/organizationStatisticsService/IOrganizationStatisticsService";
import { UpdateCouponStatisticsDTO } from "./UpdateCouponStatisticsDTO";
import { updateCouponStatisticsErrors } from "./updateCouponStatisticsErrors";

interface IKeyObjects {
    coupons: ICoupon[];
};

export class UpdateCouponStatisticsUseCase implements IUseCase<UpdateCouponStatisticsDTO.Request, UpdateCouponStatisticsDTO.Response> {
    private couponRepo: ICouponRepo;
    private organizationStatisticsService: IOrganizationStatisticsService;

    public errors = updateCouponStatisticsErrors;

    constructor(
        couponRepo: ICouponRepo,
        organizationStatisticsService: IOrganizationStatisticsService
    ) {
        this.couponRepo = couponRepo;
        this.organizationStatisticsService = organizationStatisticsService;
    }

    public async execute(_: UpdateCouponStatisticsDTO.Request): Promise<UpdateCouponStatisticsDTO.Response> {
        const keyObjectsGotten = await this.getKeyObjects();
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        let {
            coupons
        } = keyObjectsGotten.getValue()!;

        const couponIds: string[] = [];

        for (const coupon of coupons) {
            const couponsWithStatsGotten = await this.organizationStatisticsService.getCouponsWithStats([coupon]);
            if (couponsWithStatsGotten.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting coupon with stats'));
            }

            const couponWithStats = couponsWithStatsGotten.getValue()![0];
            
            coupon.organizationSum = couponWithStats.stats.organizationPoints;
            coupon.offerSum = couponWithStats.stats.cashbackSum;
            coupon.marketingSum = couponWithStats.stats.marketingSum;
            coupon.purchaseSum = couponWithStats.stats.purchaseSum;
            coupon.quantity = couponWithStats.stats.quantity;

            coupon.updatedAt = new Date();

            const couponSaved = await this.couponRepo.save(coupon);
            if (couponSaved.isSuccess) {
                couponIds.push(coupon._id.toString());
            }
        }

        return Result.ok({couponIds});
    }

    private async getKeyObjects(): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const couponsFound = await this.couponRepo.getAll();
        if (couponsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const coupons = couponsFound.getValue()!;

        return Result.ok({
            coupons
        });
    }
}