import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPaymentCreatedData, IPaymentService, IReceiptItem } from "../../../../../services/paymentService/IPaymentService";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { ILegal } from "../../../../legal/models/Legal";
import { ILegalRepo } from "../../../../legal/repo/legal/ILegalRepo";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { IOrganization } from "../../../../organizations/models/Organization";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IAccumulation } from "../../../models/Accumulation";
import { IPayment, PaymentModel } from "../../../models/Payment";
import { IPurchase } from "../../../models/Purchase";
import { ITips } from "../../../models/Tips";
import { IAccumulationRepo } from "../../../repo/accumulations/IAccumulationRepo";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ITipsRepo } from "../../../repo/tips/ITipsRepo";
import { IPaymentValidationService } from "../../../services/payments/paymentValidationService/IPaymentValidationService";
import { CalculatePurchaseMarketingUseCase } from "../../purchases/calculatePurchaseMarketing/CalculatePurchaseMarketingUseCase";
import { CreatePaymentDTO } from "./CreatePaymentDTO";
import { createPaymentErrors } from "./createPaymentErrors";

interface IPurchaseKeyObjects {
    purchase: IPurchase;
    organization: IOrganization;
    coupons: ICoupon[];
    accumulation?: IAccumulation;
    legal: ILegal;
};

interface IKeyObjects {
    global: IGlobal;
};

interface ITipsKeyObjects {
    accumulation?: IAccumulation;
    tips: ITips;
};

export class CreatePaymentUseCase implements IUseCase<CreatePaymentDTO.Request, CreatePaymentDTO.Response> {
    private paymentRepo: IPaymentRepo;
    private paymentValidationService: IPaymentValidationService;
    private paymentService: IPaymentService;
    private purchaseRepo: IPurchaseRepo;
    private globalRepo: IGlobalRepo;
    private organizationRepo: IOrganizationRepo;
    private couponRepo: ICouponRepo;
    private calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase;
    private accumulationRepo: IAccumulationRepo;
    private tipsRepo: ITipsRepo;
    private legalRepo: ILegalRepo;

    public errors = [
        ...createPaymentErrors
    ];
    constructor(
        paymentRepo: IPaymentRepo, 
        paymentValidationService: IPaymentValidationService, 
        paymentService: IPaymentService, 
        purchaseRepo: IPurchaseRepo, 
        globalRepo: IGlobalRepo, 
        organizationRepo: IOrganizationRepo, 
        couponRepo: ICouponRepo, 
        calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase,
        accumulationRepo: IAccumulationRepo,
        tipsRepo: ITipsRepo,
        legalRepo: ILegalRepo
    ) {
        this.paymentRepo = paymentRepo;
        this.paymentValidationService = paymentValidationService;
        this.paymentService = paymentService;
        this.purchaseRepo = purchaseRepo;
        this.globalRepo = globalRepo;
        this.organizationRepo = organizationRepo;
        this.couponRepo = couponRepo;
        this.calculatePurchaseMarketingUseCase = calculatePurchaseMarketingUseCase;
        this.accumulationRepo = accumulationRepo;
        this.tipsRepo = tipsRepo;
        this.legalRepo = legalRepo;
    }

    public async execute(req: CreatePaymentDTO.Request): Promise<CreatePaymentDTO.Response> {
        const valid = this.paymentValidationService.createPaymentData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects();
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            global
        } = keyObjectsGotten.getValue()!;

        if (!global.organization) {
            return Result.fail(UseCaseError.create('c', 'There is no global organization'));
        }

        const payment = new PaymentModel({
            ref: req.ref,
            currency: req.currency,
            sum: req.sum,
            type: req.type,
            usedPoints: req.usedPoints
        });

        if (payment.type == 'purchase') {
            return await this.createPurchasePayment(payment, global, req.shopId, req.safe!);            
        } else {
            return await this.createTipsPayment(payment);
        }
    }

    private async createPurchasePayment(payment: IPayment, global: IGlobal, shopId: string, safe: boolean): Promise<CreatePaymentDTO.Response> {
        const globalKeyObjectsGotten = await this.getPurchaseKeyObjects(payment);
        if (globalKeyObjectsGotten.isFailure) {
            return Result.fail(globalKeyObjectsGotten.getError());
        }

        const {
            coupons,
            organization,
            purchase,
            accumulation,
            legal
        } = globalKeyObjectsGotten.getValue()!;

        if (shopId && global.paymentShopId) {
            return await this.createSplitPurchase(payment, purchase, coupons, legal, global, shopId);
        } else if (safe) {
            return await this.createSafePurchase(payment, purchase, coupons, legal, accumulation);
        } else {
            return await this.createDefaultPurchase(payment, purchase, coupons, legal);
        }
    }

    private async createTipsPayment(payment: IPayment): Promise<CreatePaymentDTO.Response> {
        const keyObjectsGotten = await this.getTipsKeyObjects(payment);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            tips,
            accumulation
        } = keyObjectsGotten.getValue()!;
        
        const servicePaymentCreated = await this.paymentService.createPaymentSafe(payment.sum, payment.currency.toUpperCase(), 'Чаевые', payment._id, accumulation?.accumulationId);
        if (servicePaymentCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating payment'));
        }

        const servicePayment = servicePaymentCreated.getValue()!;
        
        payment.safe = true;

        payment.paymentUrl = servicePayment.confirmation.confirmation_url;

        payment.paymentId = servicePayment.id;

        const paymentSaved = await this.paymentRepo.save(payment);
        if (paymentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving payment'));
        }

        return Result.ok({
            payment
        });
    }

    private async createDefaultPurchase(payment: IPayment, purchase: IPurchase, coupons: ICoupon[], legal: ILegal): Promise<CreatePaymentDTO.Response> {
        const items = this.generateReceiptItems(purchase, coupons, payment.usedPoints);
        
        const servicePaymentCreated = await this.paymentService.createReceipt(
            payment.sum, 
            payment.currency, 
            purchase.description, 
            payment._id, 
            (<IUser>(<any>purchase.user)).email || (<IUser>(<any>purchase.user)).phone,
            items, 
            {
                Inn: legal.info.inn,
                Name: legal.info.organizationName,
                Phones: [legal.info.phone]
            }
        );

        if (servicePaymentCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating payment'));
        }

        const servicePayment = servicePaymentCreated.getValue()!;

        payment.paymentUrl = servicePayment.confirmation.confirmation_url;

        payment.paymentId = servicePayment.id;

        const paymentSaved = await this.paymentRepo.save(payment);
        if (paymentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving payment'));
        }

        return Result.ok({
            payment
        });
    }

    private async createSplitPurchase(payment: IPayment, purchase: IPurchase, coupons: ICoupon[], legal: ILegal, global: IGlobal, shopId: string): Promise<CreatePaymentDTO.Response> {
        const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({purchase: {...purchase.toObject(), user: (<any>purchase.user)._id}});
        if (purchaseMarketingCalculated.isFailure) {
            console.log(purchaseMarketingCalculated.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon calculating marketing'));
        }

        const {
            totalSum
        } = purchaseMarketingCalculated.getValue()!;

        let organizationPoints = purchase.sumInPoints - totalSum;
        let adwisePoints = totalSum;

        if (payment.sum < organizationPoints) {
            adwisePoints = payment.sum;
            organizationPoints = 0;
        } else if (payment.sum < (adwisePoints + organizationPoints) && payment.sum >= organizationPoints) {
            adwisePoints = payment.sum - organizationPoints;
        }

        const sum = Math.round(Number(((organizationPoints) * 100).toFixed(2))) + Math.round(Number(((adwisePoints) * 100).toFixed(2)));
                
        adwisePoints = Math.round(Number(((adwisePoints) * 100).toFixed(2)));
        organizationPoints = Math.round(Number(((organizationPoints) * 100).toFixed(2)));

        if (sum > payment.sum*100) {
            const difference = sum - (payment.sum*100);
            adwisePoints -= difference;
        } else if (sum < payment.sum*100) {
            const difference = (payment.sum*100) - sum;
            adwisePoints += difference;
        }


        const items = this.generateReceiptItems(purchase, coupons, payment.usedPoints);

        const shops = [
            {
                Amount: organizationPoints,
                Name: 'Продажа в системе AdWise',
                ShopCode: shopId
            },
            {
                Amount: adwisePoints,
                Name: 'Комиссия с продажи',
                ShopCode: global.paymentShopId
            }
        ];

        if (organizationPoints == 0) {
            shops.shift();
        }

        console.log(shops);
        
        const servicePaymentCreated = await this.paymentService.createReceiptSplit(
            payment.sum, 
            payment.currency, 
            purchase.description, 
            payment._id, 
            (<IUser>(<any>purchase.user)).email || (<IUser>(<any>purchase.user)).phone, 
            items, 
            shops, {
                Inn: legal.info.inn,
                Name: legal.info.organizationName,
                Phones: [legal.info.phone]
        });

        if (servicePaymentCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating payment'));
        }

        const servicePayment = servicePaymentCreated.getValue()!;

        payment.split = true;

        payment.paymentUrl = servicePayment.confirmation.confirmation_url;

        payment.paymentId = servicePayment.id;

        const paymentSaved = await this.paymentRepo.save(payment);
        if (paymentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving payment'));
        }

        return Result.ok({payment});
    }

    private async createSafePurchase(payment: IPayment, purchase: IPurchase, coupons: ICoupon[], legal: ILegal, accumulation?: IAccumulation): Promise<CreatePaymentDTO.Response> {
        const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({purchase: {...purchase.toObject(), user: (<any>purchase.user)._id}});
        if (purchaseMarketingCalculated.isFailure) {
            console.log(purchaseMarketingCalculated.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon calculating marketing'));
        }

        const {
            totalSum
        } = purchaseMarketingCalculated.getValue()!;

        let organizationPoints = purchase.sumInPoints - totalSum;

        // if (payment.sum < organizationPoints) {
        //     return await this.createDefaultPurchase(payment, purchase, coupon, organization);
        // }

        const items = this.generateReceiptItems(purchase, coupons, payment.usedPoints);
        
        const servicePaymentCreated = await this.paymentService.createReceiptSafe(
            payment.sum, 
            payment.currency, 
            purchase.description, 
            payment._id, 
            (<IUser>(<any>purchase.user)).email || (<IUser>(<any>purchase.user)).phone, 
            items, 
            {
                Inn: legal.info.inn,
                Name: legal.info.organizationName,
                Phones: [legal.info.phone]
            },
            accumulation?.accumulationId
        );

        if (servicePaymentCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating payment'));
        }

        const servicePayment = servicePaymentCreated.getValue()!;

        payment.safe = true;

        payment.paymentUrl = servicePayment.confirmation.confirmation_url;

        payment.paymentId = servicePayment.id;

        const paymentSaved = await this.paymentRepo.save(payment);
        if (paymentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving payment'));
        }

        return Result.ok({payment});
    }

    private async getPurchaseKeyObjects(payment: IPayment): Promise<Result<IPurchaseKeyObjects | null, UseCaseError | null>> {
        const purchaseFound = await this.purchaseRepo.findById(payment.ref.toHexString());
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = await purchaseFound.getValue()!.populate('user').execPopulate();

        // const couponIds = purchase.coupons.map(c => c._id.toString());

        // const couponsFound = await this.couponRepo.findByIds(couponIds);
        // if (couponsFound.isFailure) {
        //     return Result.fail(UseCaseError.create('a', 'Error upon finding coupon'));
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

        const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }
        
        const organization = organizationFound.getValue()!;

        let accumulation: IAccumulation;

        const accumulationFound = await this.accumulationRepo.findByUserAndTypeAndClosed(organization.user.toString(), 'purchase', false);
        if (accumulationFound.isSuccess) {
            accumulation = accumulationFound.getValue()!;
        }

        const legalFound = await this.legalRepo.findByOrganizationAndRelevant(organization._id.toString(), true);
        if (legalFound.isFailure) {
            return Result.fail(legalFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding legal') : UseCaseError.create('b4'));
        }

        const legal = legalFound.getValue()!;

        return Result.ok({
            coupons,
            organization,
            purchase,
            accumulation: accumulation!,
            legal
        });
    }

    private async getKeyObjects(): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const globalGotten = await this.globalRepo.getGlobal()!;
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        return Result.ok({
            global
        });
    }

    private generateReceiptItems(purchase: IPurchase, coupons: ICoupon[], usedPoints: number): IReceiptItem[] {
        let remainder = usedPoints * 100; // 10

        const items: IReceiptItem[] = [];
        
        for (const coupon of coupons) {
            let isInReceipt = false;

            for (const i in items) {
                if (items[i].Id?.includes(coupon._id.toString())) {
                    items[i].Quantity++;
                    items[i].Amount = items[i].Price * items[i].Quantity;
                    isInReceipt = true;
                }
            }

            if (isInReceipt) continue;

            items.push({
                Amount: coupon.price * 100,
                Name: coupon.name + ' ' + `(${purchase.ref.code})`,
                Price: coupon.price * 100,
                Quantity: 1,
                Tax: 'none',
                PaymentObject: coupon.type == 'service' ? 'service' : 'commodity',
                Id: coupon._id.toString()
            });
        }

        for (const i in items) {
            delete items[i].Id;

            let price = items[i].Price;
            let amount = items[i].Amount;
            let quantity = items[i].Quantity;
            
            if (remainder) {
                amount -= remainder;
                remainder = 0;
            }

            if (amount < 0) {
                remainder = Math.abs(amount);
                amount = 0;
            }

            price = amount / quantity;

            items[i].Quantity = quantity;
            items[i].Amount = amount;
            items[i].Price = price;
        }

        console.log(items);

        return items;
    }

    private async getTipsKeyObjects(payment: IPayment): Promise<Result<ITipsKeyObjects | null, UseCaseError | null>> {
        const tipsFound = await this.tipsRepo.findById(payment.ref.toString());
        if (tipsFound.isFailure) {
            return Result.fail(tipsFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding tips') : UseCaseError.create('6'));
        }

        const tips = tipsFound.getValue()!;

        let accumulation: IAccumulation;

        const accumulationFound = await this.accumulationRepo.findByUserAndTypeAndClosed(tips.to.toString(), 'tips', false);
        if (accumulationFound.isSuccess) {
            accumulation = accumulationFound.getValue()!;
        }

        return Result.ok({
            tips,
            accumulation: accumulation!
        });
    }
}