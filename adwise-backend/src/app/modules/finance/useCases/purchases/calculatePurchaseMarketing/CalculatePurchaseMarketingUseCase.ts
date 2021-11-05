import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { IOrganization } from "../../../../organizations/models/Organization";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IOffer } from "../../../models/Offer";
import { IPurchase } from "../../../models/Purchase";
import { IOfferRepo } from "../../../repo/offers/IOfferRepo";
import { IPurchaseValidationService } from "../../../services/purchases/purchaseValidationService/IPurchaseValidationService";
import { CalculateRefPaymentsUseCase } from "../../subscriptions/calculateRefPayments/CalculateRefPaymentsUseCase";
import { CalculatePurchaseMarketingDTO } from "./CalculatePurchaseMarketingDTO";
import { calculatePurchaseMarketingErrors } from "./calculatePurchaseMarketingErrors";

interface IKeyObjects {
    global: IGlobal;
    offers: IOffer[];
    coupons: ICoupon[];
    organization: IOrganization;
};

export class CalculatePurchaseMarketingUseCase implements IUseCase<CalculatePurchaseMarketingDTO.Request, CalculatePurchaseMarketingDTO.Response> {
    private globalRepo: IGlobalRepo;
    private offerRepo: IOfferRepo;
    private purchaseValidationService: IPurchaseValidationService;
    private calculateRefPaymentsUseCase: CalculateRefPaymentsUseCase;
    private couponRepo: ICouponRepo
    private organizationRepo: IOrganizationRepo;

    public errors = calculatePurchaseMarketingErrors;

    constructor(
        couponRepo: ICouponRepo, 
        globalRepo: IGlobalRepo, 
        purchaseValidationService: IPurchaseValidationService, 
        offerRepo: IOfferRepo, 
        calculateRefPaymentsUseCase: CalculateRefPaymentsUseCase,
        organizationRepo: IOrganizationRepo
    ) {
        this.globalRepo = globalRepo;
        this.offerRepo = offerRepo;
        this.purchaseValidationService = purchaseValidationService;
        this.calculateRefPaymentsUseCase = calculateRefPaymentsUseCase;
        this.couponRepo = couponRepo;
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: CalculatePurchaseMarketingDTO.Request): Promise<CalculatePurchaseMarketingDTO.Response> {
        const valid = this.purchaseValidationService.calculatePurchaseMarketingData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.purchase);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        } 

        const {
            global,
            offers,
            coupons,
            organization
        } = keyObjectsGotten.getValue()!;

        let paymentGatewaySum = req.purchase.sumInPoints * (global.paymentGatewayPercent / 100);

        if (paymentGatewaySum < global.paymentGatewayMinimalFee) {
            paymentGatewaySum = global.paymentGatewayMinimalFee;
        }

        const managerSum = organization.manager ? req.purchase.sumInPoints * (global.managerPercent / 100) : 0;

        const adwiseSum = (req.purchase.sumInPoints * (global.purchasePercent / 100)) - managerSum - paymentGatewaySum;

        const adwiseSumForCash = adwiseSum + paymentGatewaySum;

        const couponsWithOfferSum: CalculatePurchaseMarketingDTO.ICouponWithOfferSum[] = [];

        const offerPayments = offers.map(o => {
            const coupon = coupons.find(c => c.offer.toString() == o._id.toString())!;

            const offerSum = coupon.price * (o.percent / 100);

            couponsWithOfferSum.push({
                coupon: coupon,
                offerSum: Math.round(offerSum * 100) / 100
            });

            return offerSum;
        });

        const offerTotalSum = offerPayments.reduce((sum, cur) => sum += cur, 0);
        
        const refPaymentsCalculated = await this.calculateRefPaymentsUseCase.execute({
            purchase: req.purchase
        });

        if (refPaymentsCalculated.isFailure) {
            console.log(refPaymentsCalculated.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon calculating ref payments'));
        }

        const refPayments = refPaymentsCalculated.getValue()!.refPayments;

        const refSum = refPayments.reduce((sum, cur) => sum += cur.sum, 0);

        const totalSum = refSum + adwiseSum + managerSum + offerTotalSum + paymentGatewaySum;

        const totalSumForCash = refSum + adwiseSumForCash + managerSum + offerTotalSum;

        const couponsWithMarketing: CalculatePurchaseMarketingDTO.ICouponWithMarketing[] = coupons.map((c, i) => {
            let couponPaymentGatewaySum = paymentGatewaySum / coupons.length;

            const managerSum = c.price * (global.managerPercent / 100);

            const adwiseSum = (c.price * (global.purchasePercent / 100)) - managerSum - couponPaymentGatewaySum;

            const adwiseSumForCash = adwiseSum + couponPaymentGatewaySum;

            const offerSum = couponsWithOfferSum.find(co => co.coupon._id.toString() == c._id.toString())!.offerSum;

            const refSum = refPayments.filter(rp => rp.index == i && rp.coupon._id.toString() == c._id.toString()).reduce((sum, cur) => sum += cur.sum, 0);

            const totalSum = refSum + adwiseSum + managerSum + offerSum + couponPaymentGatewaySum;

            const totalSumForCash = refSum + adwiseSumForCash + managerSum + offerSum;

            return {
                managerSum: Math.round(managerSum * 100) / 100,
                adwiseSum: Math.round(adwiseSum * 100) / 100,
                adwiseSumForCash: Math.round(adwiseSumForCash * 100) / 100,
                totalSum: Math.round(totalSum * 100) / 100,
                totalSumForCash: Math.round(totalSumForCash * 100) / 100,
                coupon: c,
                offerSum: Math.round(offerSum * 100) / 100,
                refSum: Math.round(refSum * 100) / 100,
                paymentGatewaySum: Math.round(couponPaymentGatewaySum * 100) / 100
            };
        });

        return Result.ok({
            adwiseSum: Math.round(adwiseSum * 100) / 100,
            adwiseSumForCash: Math.round(adwiseSumForCash * 100) / 100,
            managerSum: Math.round(managerSum * 100) / 100,
            offerTotalSum: Math.round(offerTotalSum * 100) / 100,
            offerPayments,
            refSum: Math.round(refSum * 100) / 100,
            totalSum: Math.round(totalSum * 100) / 100,
            paymentGatewaySum: Math.round(paymentGatewaySum * 100) / 100,
            totalSumForCash: Math.round(totalSumForCash * 100) / 100,
            refPayments,
            couponsWithOfferSum,
            couponsWithMarketing
        });
    }

    private async getKeyObjects(purchase: IPurchase): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        // const couponIds = purchase.coupons.map(c => c._id.toString());

        // const couponsFound = await this.couponRepo.findByIds(couponIds);
        // if (couponsFound.isFailure) {
        //     return Result.fail(couponsFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
        // }

        // const coupons = couponsFound.getValue()!;

        // TEMPORARY
        const coupons: ICoupon[] = purchase.coupons;

        // for (const coupon of purchase.coupons) {
        //     const couponFound = await this.couponRepo.findById(coupon._id);
        //     if (couponFound.isFailure) {
        //         return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
        //     }

        //     coupons.push(couponFound.getValue()!);
        // }

        // const offerIds = coupons.map(c => c.offer.toString());

        // const offersFound = await this.offerRepo.findByIds(offerIds);
        // if (offersFound.isFailure) {
        //     return Result.fail(offersFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding offer') : UseCaseError.create('p'));
        // }
        // 
        // const offers = offersFound.getValue()!;

        const offers: IOffer[] = [];
        
        for (const coupon of coupons) {
            const offerFound = await this.offerRepo.findById(coupon.offer.toString());
            if (offerFound.isFailure) {
                return Result.fail(offerFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding offer') : UseCaseError.create('p'))
            }

            offers.push(offerFound.getValue()!);
        }

        const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'))
        }

        const organization = organizationFound.getValue()!;

        return Result.ok({
            global,
            offers,
            coupons,
            organization
        });
    }
}