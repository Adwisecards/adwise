import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { logger } from "../../../../../services/logger";
import { INotificationService } from "../../../../../services/notificationService/INotificationService";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IContact } from "../../../../contacts/models/Contact";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IEventListenerService } from "../../../../global/services/eventListenerService/IEventListenerService";
import { SendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification/SendNotificationUseCase";
import { CouponModel, ICoupon } from "../../../../organizations/models/Coupon";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IClientRepo } from "../../../../organizations/repo/clients/IClientRepo";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { CreateRefUseCase } from "../../../../ref/useCases/createRef/CreateRefUseCase";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { CreateUserNotificationUseCase } from "../../../../users/useCases/userNotifications/createUserNotification/CreateUserNotificationUseCase";
import { IOffer, OfferModel } from "../../../models/Offer";
import { PurchaseModel } from "../../../models/Purchase";
import { IWallet } from "../../../models/Wallet";
import { IOfferRepo } from "../../../repo/offers/IOfferRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { IPurchaseValidationService } from "../../../services/purchases/purchaseValidationService/IPurchaseValidationService";
import { CalculatePurchaseMarketingUseCase } from "../calculatePurchaseMarketing/CalculatePurchaseMarketingUseCase";
import { CreatePurchaseDTO } from "./CreatePurchaseDTO";
import { createPurchaseErrors } from "./createPurchaseErrors";

interface IKeyObjects {
    user: IUser;
    global: IGlobal;
    coupons: ICoupon[];
    purchaserContact?: IContact;
    cashierContact?: IContact;
    organization: IOrganization;
    offers: IOffer[];
    organizationWallet: IWallet;
    purchaserUser?: IUser; 
};

export class CreatePurchaseUseCase implements IUseCase<CreatePurchaseDTO.Request, CreatePurchaseDTO.Response> {
    public errors: UseCaseError[] = [
        ...createPurchaseErrors
    ];

    private purchaseRepo: IPurchaseRepo;
    private contactRepo: IContactRepo;
    private organizationRepo: IOrganizationRepo;
    private couponRepo: ICouponRepo;
    private offerRepo: IOfferRepo;
    private purchaseValidationService: IPurchaseValidationService;
    private userRepo: IUserRepo;
    private createRefUseCase: CreateRefUseCase;
    private eventListenerService: IEventListenerService;
    private globalRepo: IGlobalRepo;
    private walletRepo: IWalletRepo;
    private sendNotificationUseCase: SendNotificationUseCase;
    private clientRepo: IClientRepo;
    private calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase;
    private createUserNotificationUseCase: CreateUserNotificationUseCase;
    
    constructor(
        purchaseRepo: IPurchaseRepo, 
        contactRepo: IContactRepo, 
        organizationRepo: IOrganizationRepo, 
        couponRepo: ICouponRepo, 
        offerRepo: IOfferRepo, 
        purchaseValidationService: IPurchaseValidationService, 
        userRepo: IUserRepo, 
        createRefUseCase: CreateRefUseCase, 
        eventListenerService: IEventListenerService,
        globalRepo: IGlobalRepo,
        walletRepo: IWalletRepo,
        sendNotificationUseCase: SendNotificationUseCase,
        clientRepo: IClientRepo,
        calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase,
        createUserNotificationUseCase: CreateUserNotificationUseCase
    ) {
        this.purchaseRepo = purchaseRepo;
        this.contactRepo = contactRepo;
        this.organizationRepo = organizationRepo;
        this.couponRepo = couponRepo;
        this.offerRepo = offerRepo;
        this.purchaseValidationService = purchaseValidationService;
        this.userRepo = userRepo;
        this.createRefUseCase = createRefUseCase;
        this.eventListenerService = eventListenerService;
        this.globalRepo = globalRepo;
        this.walletRepo = walletRepo;
        this.sendNotificationUseCase = sendNotificationUseCase;
        this.clientRepo = clientRepo;
        this.calculatePurchaseMarketingUseCase = calculatePurchaseMarketingUseCase;
        this.createUserNotificationUseCase = createUserNotificationUseCase;
    }

    public async execute(req: CreatePurchaseDTO.Request): Promise<CreatePurchaseDTO.Response> {
        const valid = this.purchaseValidationService.createPurchaseData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const couponIds: string[] = [];

        for (const coupon of req.coupons) {
            for (let i = 0; i < coupon.count; i++) {
                couponIds.push(coupon.couponId);
            }
        }


        const keyObjectsGotten = await this.getKeyObjects(req.userId, couponIds, req.purchaserContactId, req.cashierContactId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            coupons,
            global,
            offers,
            organization,
            organizationWallet,
            cashierContact,
            purchaserContact,
            purchaserUser,
            user
        } = keyObjectsGotten.getValue()!;

        console.log(req.coupons);

        if (req.asOrganization && user.organization?.toString() != organization._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not of organization'));
        }

        if (purchaserUser) {
            const clientFound = await this.clientRepo.findByOrganizationAndUser(organization._id.toString(), purchaserUser?._id.toString());
            if (clientFound.isFailure) {
                return Result.fail(UseCaseError.create('c', 'User is not a client'));
            }

            const client = clientFound.getValue()!;
            if (client.disabled) {
                return Result.fail(UseCaseError.create('c', 'User is not a client'));
            }
        }

        if (organization.disabled) {
            return Result.fail(UseCaseError.create('c', 'Organization is disabled'));
        }

        // Check if there is a global organization
        if (!global.organization) {
            return Result.fail(UseCaseError.create('c', 'There is no global organization'));
        } 
        
        // Check if any coupon is not suitable for sale
        for (const coupon of coupons) {
            // if (coupon.floating && !req.asOrganization) {
            //     return Result.fail(UseCaseError.create('c', 'Purchase containing coupon with floating price should be created from organization'));
            // }

            const couponQuantity = req.coupons.find(c => c.couponId == coupon._id.toString())?.count || 0;

            if ((coupon! && coupon!.disabled) || (coupon! && coupon!.quantity == 0) || couponQuantity > coupon.quantity) {
                return Result.fail(UseCaseError.create('v'));
            }
        }

        const purchaseCoupons: ICoupon[] = [];

        // Wipe all coupon statistical data
        for (const coupon of coupons) {
            const purchaseCoupon = new CouponModel({
                ...coupon!.toObject()
            });

            if (purchaseCoupon.floating) {
                const price = req.coupons.find(c => c.couponId == purchaseCoupon._id.toString())?.price || purchaseCoupon.price;
                purchaseCoupon.price = price;
            }
    
            purchaseCoupon.marketingSum = 0;
            purchaseCoupon.purchaseSum = 0;
            purchaseCoupon.offerSum = 0;
            purchaseCoupon.organizationSum = 0;
    
            const purchaseCouponRefCreated = await this.createRefUseCase.execute({
                mode: purchaseCoupon.ref.mode,
                ref: purchaseCoupon.ref.ref.toString(),
                type: purchaseCoupon.ref.type
            });
    
            if (purchaseCouponRefCreated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon creating coupon ref'));
            }
    
            const purchaseCouponRef = purchaseCouponRefCreated.getValue()!;
    
            purchaseCoupon.ref = purchaseCouponRef;

            purchaseCoupons.push(purchaseCoupon);
        }

        const totalSum = purchaseCoupons.reduce((sum, cur) => sum += cur.price, 0);

        const purchase = new PurchaseModel({
            organization: organization._id,
            purchaser: purchaserContact! ? purchaserContact!._id : undefined,
            cashier: cashierContact?._id,
            sumInPoints: totalSum, // calculate total
            currency: organizationWallet.currency,
            description: req.description,
            user: purchaserUser?._id,
            coupons: purchaseCoupons,
            offers: offers
        });

        // logger.infoWithMeta('Purchase created', {purchase: purchase.toObject()});

        const refCreated = await this.createRefUseCase.execute({
            ref: purchase._id,
            mode: 'purchase',
            type: 'create'
        });

        if (refCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
        }

        const ref = refCreated.getValue()!;

        purchase.ref = ref;

        if (purchaserUser) {
            purchaserUser.purchases.push(purchase._id);

            // purchaserUser.logs.unshift({
            //     ref: purchase._id,
            //     type: 'purchaseCreated',
            //     timestamp: new Date()
            // });
        }

        const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({
            purchase: purchase
        });

        if (purchaseMarketingCalculated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon calculating purchase marketing'));
        }

        const {
            offerTotalSum
        } = purchaseMarketingCalculated.getValue()!;

        purchase.totalCashbackSum = offerTotalSum;

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        if (purchaserUser) {
            const userSaved = await this.userRepo.save(purchaserUser);
            if (userSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
            }
        }

        if (purchaserUser) {
            await this.sendNotificationUseCase.execute({
                type: 'purchaseCreated',
                receiverIds: [purchaserUser._id.toString()],
                values: {
                    sumInPoints: purchase.sumInPoints
                },
                data: {
                    purchaseId: purchase._id
                }
            });

            const result = await this.createUserNotificationUseCase.execute({
                level: 'info',
                type: 'purchaseCreated',
                userId: purchaserUser._id.toString(),
                purchaseId: purchase._id.toString()
            });

            console.log(result);

            this.eventListenerService.dispatchEvent({
                id: purchaserUser._id.toString(),
                subject: purchase._id.toString(),
                type: 'purchaseCreated'
            });
        }

        if (cashierContact) {
            this.eventListenerService.dispatchEvent({
                id: cashierContact.ref.toString(),
                subject: purchase._id.toString(),
                type: 'purchaseCreated'
            });
        }

        return Result.ok({purchaseId: purchase._id});
    }

    private async getKeyObjects(userId: string, couponIds: string[], purchaserContactId: string, cashierContactId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        // TEMPORARY
        const coupons: ICoupon[] = [];

        for (const couponId of couponIds) {
            const couponFound = await this.couponRepo.findById(couponId);
            if (couponFound.isFailure) {
                return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
            }

            coupons.push(couponFound.getValue()!);
        }
        
        // const couponsFound = await this.couponRepo.findByIds(couponIds);
        // if (couponsFound.isFailure) {
        //     return Result.fail(UseCaseError.create('a', 'Error upon finding coupons'));
        // }

        if (!coupons.length) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding coupons'));
        }

        const offers: IOffer[] = [];

        for (const coupon of coupons) {
            const offerFound = await this.offerRepo.findById(coupon.offer.toString());
            if (offerFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding offer'));
            }

            const offer = offerFound.getValue()!;
            offers.push(offer);
        }

        if (offers.length != coupons.length) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding offers'));
        }

        let cashierContact: IContact;
        if (cashierContactId) {
            const cashierContactFound = await this.contactRepo.findById(cashierContactId);
            if (cashierContactFound.isFailure) {
                return Result.fail(cashierContactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding cashier') : UseCaseError.create('w', 'Cashier does not exist'));
            }
        
            cashierContact = cashierContactFound.getValue()!;
        }

        let purchaserContact: IContact;
        if (purchaserContactId) {
            const purchaserContactFound = await this.contactRepo.findById(purchaserContactId);
            if (purchaserContactFound.isFailure) {
                return Result.fail(purchaserContactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchaser contact') : UseCaseError.create('w', 'Purchaser contact does not exist'));
            }

            purchaserContact = purchaserContactFound.getValue()!;
        }

        const organizationFound = await this.organizationRepo.findById(coupons[0].organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const organizationWalletFound = await this.walletRepo.findById(organization.wallet.toString());
        if (organizationWalletFound.isFailure) {
            return Result.fail(organizationWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization wallet') : UseCaseError.create('r'))
        }

        const organizationWallet = organizationWalletFound.getValue()!;

        let purchaserUser: IUser;

        if (purchaserContact!) {
            const purchaserUserFound = await this.userRepo.findById(purchaserContact!.ref.toString());
            if (purchaserUserFound.isFailure) {
                return Result.fail(purchaserUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchaser user') : UseCaseError.create('m', 'Purchaser user does not exist'));
            }

            purchaserUser = purchaserUserFound.getValue()!;
        }

        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding user") : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;
  
        return Result.ok({
            coupons,
            global,
            cashierContact: cashierContact!,
            purchaserContact: purchaserContact!,
            organization,
            offers,
            organizationWallet,
            purchaserUser: purchaserUser!,
            user
        });
    }
}