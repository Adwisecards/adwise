import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPurchase } from "../../../models/Purchase";
import { ISubscription } from "../../../models/Subscription";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ISubscriptionRepo } from "../../../repo/subscriptions/ISubscriptionRepo";
import { ISubscriptionValidationService } from "../../../services/subscriptions/subscriptionValidationService/ISubscriptionValidationService";
import { CalculateRefPaymentsDTO } from './CalculateRefPaymentsDTO';
import { calculateRefPaymentsErrors } from "./calculateRefPaymentsErrors";

// Key objects that we need to successfully resolve our tree
interface ICalculateRefPaymentsKeyObjects {
    purchase: IPurchase;
    subscription: ISubscription;
    coupons: ICoupon[];
};

interface ICouponRefPayments {
    firstLevel: number;
    otherLevel: number;
    coupon: ICoupon;
    index: number;
};

export class CalculateRefPaymentsUseCase implements IUseCase<CalculateRefPaymentsDTO.Request, CalculateRefPaymentsDTO.Response> {
    private subscriptionRepo: ISubscriptionRepo;
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private couponRepo: ICouponRepo;
    private subscriptionValidationService: ISubscriptionValidationService;

    public errors = calculateRefPaymentsErrors;

    constructor(
        subscriptionRepo: ISubscriptionRepo,
        userRepo: IUserRepo,
        organizationRepo: IOrganizationRepo,
        couponRepo: ICouponRepo,
        subscriptionValidationService: ISubscriptionValidationService
    ) {
        this.subscriptionRepo = subscriptionRepo;
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.couponRepo = couponRepo;
        this.subscriptionValidationService = subscriptionValidationService;
    }

    public async execute(req: CalculateRefPaymentsDTO.Request): Promise<CalculateRefPaymentsDTO.Response> {
        const valid = this.subscriptionValidationService.calculateRefPaymentsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        // Get key objects to work with
        const keyObjectsGotten = await this.getKeyObjects(req.purchase);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            coupons,
            purchase,
            subscription,
        } = keyObjectsGotten.getValue()!;

        // Once we get everything for a start, we need to get subscription branch
        const subscriptionBranchResolved = await this.resolveSubscriptionBranch(subscription);
        if (subscriptionBranchResolved.isFailure) {
            return Result.fail(subscriptionBranchResolved.getError());
        }

        const subscriptionBranch = subscriptionBranchResolved.getValue()!;

        // Calculating payments that'll go to the branch
        const couponRefPayments: ICouponRefPayments[] = [];

        for (const index in coupons) {
            const coupon = coupons[index];

            const firstLevelPayment =  coupon.price * (coupon.distributionSchema.first / 100),
                  otherLevelPayment = coupon.price * (coupon.distributionSchema.other / 100);
            
            couponRefPayments.push({
                firstLevel: Math.round(firstLevelPayment * 100) / 100,
                otherLevel: Math.round(otherLevelPayment * 100) / 100,
                coupon: coupon,
                index: Number(index)
            });
        }
        
        // Once we've got subscription branch and payments, let's calculate referal payments
        const refPayments = this.calculateRefPayments(subscriptionBranch, couponRefPayments, req.purchase);

        return Result.ok({refPayments});
    }

    private calculateRefPayments(subscriptionBranch: ISubscription[], couponRefPayments: ICouponRefPayments[], purchase: IPurchase): CalculateRefPaymentsDTO.IRefPayment[] {     
        const refPayments: CalculateRefPaymentsDTO.IRefPayment[] = [];
        
        let isFirstLevel = true;
        for (const subscription of subscriptionBranch) {
            for (const couponRefPayment of couponRefPayments) {
                refPayments.push({
                    subscription,
                    sum: isFirstLevel ? couponRefPayment.firstLevel : couponRefPayment.otherLevel,
                    purchase,
                    coupon: couponRefPayment.coupon,
                    index: couponRefPayment.index
                });
            }

            isFirstLevel = false;
        }

        return refPayments;
    }

    private async resolveSubscriptionBranch(subscription: ISubscription): Promise<Result<ISubscription[] | null, UseCaseError | null>> {
        const subscriptionBranch: ISubscription[] = [];

        let i = 1;
        while (subscription.parent && i <= 21) {

            const parentSubscriptionFound = await this.subscriptionRepo.findById(subscription.parent.toString());
            if (parentSubscriptionFound.isFailure) {
                return Result.fail(parentSubscriptionFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding parent subscription') : UseCaseError.create('n'));
            }

            subscription = parentSubscriptionFound.getValue()!;
            subscriptionBranch.push(subscription);
            i++;
        }

        return Result.ok(subscriptionBranch);
    }

    private async getKeyObjects(purchase: IPurchase): Promise<Result<ICalculateRefPaymentsKeyObjects | null, UseCaseError | null>> {
        const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
        if (organizationFound.isFailure) {
           return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }
        
        const organization = organizationFound.getValue()!;

        const userFound = await this.userRepo.findById(purchase.user.toString());
        if (userFound.isFailure) {
            console.log(userFound.getError());
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const subscriptionFound = await this.subscriptionRepo.findByUserAndOrganization(user._id, organization._id);
        if (subscriptionFound.isFailure) {
            return Result.fail(subscriptionFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding subscription') : UseCaseError.create('n'))
        }

        const subscription = subscriptionFound.getValue()!;

        // const couponIds = purchase.coupons.map(c => c._id.toString());

        // const couponsFound = await this.couponRepo.findByIds(couponIds);
        // if (couponsFound.isFailure) {
        //     return Result.fail(couponsFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
        // }

        // const coupons = couponsFound.getValue()!;

        const coupons: ICoupon[] = purchase.coupons;

        // for (const coupon of purchase.coupons) {
        //     const couponFound = await this.couponRepo.findById(coupon._id);
        //     if (couponFound.isFailure) {
        //         return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
        //     }

        //     coupons.push(couponFound.getValue()!);
        // }

        return Result.ok({
            coupons,
            purchase,
            subscription
        });
    }
}