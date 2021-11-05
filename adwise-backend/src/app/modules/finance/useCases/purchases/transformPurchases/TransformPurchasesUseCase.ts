import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOfferRepo } from "../../../repo/offers/IOfferRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { TransformPurchasesDTO } from "./TransformPurchasesDTO";
import { transformPurchasesErrors } from "./transformPurchasesErrors";

export class TransformPurchasesUseCase implements IUseCase<TransformPurchasesDTO.Request, TransformPurchasesDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private offerRepo: IOfferRepo;

    public errors = transformPurchasesErrors;

    constructor(purchaseRepo: IPurchaseRepo, offerRepo: IOfferRepo) {
        this.purchaseRepo = purchaseRepo;
        this.offerRepo = offerRepo;
    }

    public async execute(_: TransformPurchasesDTO.Request): Promise<TransformPurchasesDTO.Response> {
        const purchasesGotten = await this.purchaseRepo.getAll();
        if (purchasesGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting purchases'));
        }

        const purchases = purchasesGotten.getValue()!;

        const transformedPurchaseIds: string[] = [];

        for (const purchase of purchases) {
            if (purchase.coupon) {
                purchase.coupons = [purchase.coupon];
                purchase.coupon = undefined as any;
            }

            if (purchase.offer) {
                purchase.offers = [purchase.offer];
                purchase.offer = undefined as any;
            } else {
                const offerIds = purchase.coupons.map(c => c.offer.toString());
                
                const offersFound = await this.offerRepo.findByIds(offerIds);
                if (offersFound.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon finding offers'));
                }

                const offers = offersFound.getValue()!;

                purchase.offers = offers;
                purchase.offer = undefined as any;
            }

            const purchaseSaved = await this.purchaseRepo.save(purchase);
            if (purchaseSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
            }

            transformedPurchaseIds.push(purchase._id.toString());
        }

        return Result.ok({purchaseIds: transformedPurchaseIds});
    }
}