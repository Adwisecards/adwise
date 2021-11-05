import c from "express-cluster";
import { number } from "joi";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { logger } from "../../../../../services/logger";
import { INotificationService } from "../../../../../services/notificationService/INotificationService";
import { ITelegramService } from "../../../../../services/telegramService/ITelegramService";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IContact } from "../../../../contacts/models/Contact";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IEventListenerService } from "../../../../global/services/eventListenerService/IEventListenerService";
import { SendNotificationUseCase } from "../../../../notification/useCases/notifications/sendNotification/SendNotificationUseCase";
import { IClient } from "../../../../organizations/models/Client";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { IEmployee } from "../../../../organizations/models/Employee";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IClientRepo } from "../../../../organizations/repo/clients/IClientRepo";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { IEmployeeRepo } from "../../../../organizations/repo/employees/IEmployeeRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { CreateOrganizationNotificationUseCase } from "../../../../organizations/useCases/organizationNotifications/createOrganizationNotification/CreateOrganizationNotificationUseCase";
import { GetOrganizationCashierContactsUseCase } from "../../../../organizations/useCases/organizations/getOrganizationCashierContacts/GetOrganizationCashierContactsUseCase";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { createUserNotificationUseCase } from "../../../../users/useCases/userNotifications/createUserNotification";
import { CreateUserNotificationUseCase } from "../../../../users/useCases/userNotifications/createUserNotification/CreateUserNotificationUseCase";
import { IPayment } from "../../../models/Payment";
import { IPurchase } from "../../../models/Purchase";
import { IWallet } from "../../../models/Wallet";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { IPurchaseValidationService } from "../../../services/purchases/purchaseValidationService/IPurchaseValidationService";
import { DistributeToSubscriptionsUseCase } from "../../subscriptions/distributeToSubscriptions/DistributeToSubscriptionsUseCase";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { DisableTransactionsWithContextUseCase } from "../../transactions/disableTransactionsWithContext/DisableTransactionsWithContextUseCase";
import { CalculatePurchaseMarketingUseCase } from "../calculatePurchaseMarketing/CalculatePurchaseMarketingUseCase";
import { ConfirmPurchaseDTO } from "./ConfirmPurchaseDTO";
import { confirmPurchaseErrors } from "./confirmPurchaseErrors";

interface IKeyObjects {
    purchase: IPurchase;
    payment: IPayment;
    userWallet: IWallet;
    organizationWallet: IWallet;
    managerWallet?: IWallet;
    organization: IOrganization;
    user: IUser;
    coupons: ICoupon[];
    client?: IClient;
    organizationCashierContacts: IContact[];
    global: IGlobal;
    globalOrganization: IOrganization;
    // employee: IEmployee;
};

export class ConfirmPurchaseUseCase implements IUseCase<ConfirmPurchaseDTO.Request, ConfirmPurchaseDTO.Response> {
    public errors: UseCaseError[] = [
        ...confirmPurchaseErrors
    ];

    private userRepo: IUserRepo;
    private walletRepo: IWalletRepo;
    private organizationRepo: IOrganizationRepo;
    private purchaseRepo: IPurchaseRepo;
    private distributeToSubscriptionsUseCase: DistributeToSubscriptionsUseCase;
    private createTransactionUseCase: CreateTransactionUseCase;
    private purchaseValidationService: IPurchaseValidationService;
    private calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase;
    private couponRepo: ICouponRepo;
    private employeeRepo: IEmployeeRepo;
    private clientRepo: IClientRepo;
    private eventListenerService: IEventListenerService;
    private getOrganizationCashierContactsUseCase: GetOrganizationCashierContactsUseCase;
    private globalRepo: IGlobalRepo;
    private disableTransactionsWithContextUseCase: DisableTransactionsWithContextUseCase;
    private sendNotificationUseCase: SendNotificationUseCase;
    private createOrganizationNotificationUseCase: CreateOrganizationNotificationUseCase;
    private createUserNotificationUseCase: CreateUserNotificationUseCase;
    private telegramService: ITelegramService;
    private paymentRepo: IPaymentRepo;

    constructor(
        userRepo: IUserRepo, 
        walletRepo: IWalletRepo, 
        organizationRepo: IOrganizationRepo, 
        purchaseRepo: IPurchaseRepo, 
        distributeToSubscriptionsUseCase: DistributeToSubscriptionsUseCase, 
        createTransactionUseCase: CreateTransactionUseCase, 
        purchaseValidationService: IPurchaseValidationService,
        calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase,
        couponRepo: ICouponRepo,
        employeeRepo: IEmployeeRepo,
        clientRepo: IClientRepo,
        eventListenerService: IEventListenerService,
        getOrganizationCashierContactsUseCase: GetOrganizationCashierContactsUseCase,
        globalRepo: IGlobalRepo,
        disableTransactionsWithContextUseCase: DisableTransactionsWithContextUseCase,
        sendNotificationUseCase: SendNotificationUseCase,
        createOrganizationNotificationUseCase: CreateOrganizationNotificationUseCase,
        createUserNotificationUseCase: CreateUserNotificationUseCase,
        telegramService: ITelegramService,
        paymentRepo: IPaymentRepo
    ) {
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.organizationRepo = organizationRepo;
        this.purchaseRepo = purchaseRepo;
        this.distributeToSubscriptionsUseCase = distributeToSubscriptionsUseCase;
        this.createTransactionUseCase = createTransactionUseCase;
        this.purchaseValidationService = purchaseValidationService;
        this.calculatePurchaseMarketingUseCase = calculatePurchaseMarketingUseCase;
        this.couponRepo = couponRepo;
        this.employeeRepo = employeeRepo;
        this.clientRepo = clientRepo;
        this.eventListenerService = eventListenerService;
        this.getOrganizationCashierContactsUseCase = getOrganizationCashierContactsUseCase;
        this.globalRepo = globalRepo;
        this.disableTransactionsWithContextUseCase = disableTransactionsWithContextUseCase;
        this.sendNotificationUseCase = sendNotificationUseCase;
        this.createOrganizationNotificationUseCase = createOrganizationNotificationUseCase;
        this.createUserNotificationUseCase = createUserNotificationUseCase;
        this.telegramService = telegramService;
        this.paymentRepo = paymentRepo;
    }

    public async execute(req: ConfirmPurchaseDTO.Request): Promise<ConfirmPurchaseDTO.Response> {
        const valid = this.purchaseValidationService.confirmPurchaseData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.purchaseId, req.resolvedObjects);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            purchase,
            payment,
            userWallet,
            organizationWallet,
            managerWallet,
            organization,
            user,
            coupons,
            client,
            organizationCashierContacts,
            globalOrganization
            //employee
        } = keyObjectsGotten.getValue()!;

        // Check if all coupons are suitable for sale
        for (const coupon of coupons) {
            if (coupon.quantity <= 0 || coupon.disabled) {
                return Result.fail(UseCaseError.create('c', 'Coupon is disabled or it\'s quantity equals to 0'));
            }
        }

        const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({
            purchase
        });
        
        if (purchaseMarketingCalculated.isFailure) {
            await this.disableTransactionsWithContextUseCase.execute({
                context: purchase._id.toString()
            })
            return Result.fail(UseCaseError.create('a', 'Error upon calculating marketing'));
        }

        let {
            adwiseSum,
            managerSum,
            offerPayments,
            offerTotalSum,
            refSum,
            refPayments,
            totalSum,
            adwiseSumForCash,
            totalSumForCash,
            paymentGatewaySum,
            couponsWithOfferSum,
            couponsWithMarketing
        } = purchaseMarketingCalculated.getValue()!;

        const origin = req.cash ? 'cash' : (req.safe ? 'safe' : (req.split ? 'split' : 'online'));

        for (const index in couponsWithMarketing) {
            const coupon = couponsWithMarketing[index];

            const offerSum = coupon.offerSum;
            const organizationPoints = coupon.coupon.price - (origin == 'cash' ? coupon.totalSumForCash : coupon.totalSum);
            const adwisePoints = Number(index) == 0 ? (origin == 'cash' ? adwiseSumForCash : adwiseSum) : 0;
            const paymentGatewayPoints = Number(index) == 0 ? (origin == 'cash' ? 0 : paymentGatewaySum) : 0;
            const managerPoints = Number(index) == 0 ? managerSum : 0;

            const transactionExecuted = await this.executeTransactions(
                paymentGatewayPoints,
                adwisePoints,
                managerPoints,
                offerSum, 
                organizationPoints, 
                userWallet, 
                organizationWallet, 
                managerWallet, 
                purchase, 
                user, 
                organization, 
                couponsWithOfferSum[index], 
                origin, 
                globalOrganization
            );
            
            if (transactionExecuted.isFailure) {
                await this.disableTransactionsWithContextUseCase.execute({
                    context: purchase._id.toString()
                })
                return Result.fail(transactionExecuted.getError());
            }
        }

        const distributedToSubscriptions = await this.distributeToSubscriptionsUseCase.execute({
            refPayments: refPayments,
            cash: req.cash,
            safe: req.safe,
            split: req.split
        });

        if (distributedToSubscriptions.isFailure) {
            console.log(distributedToSubscriptions.getError());
            await this.disableTransactionsWithContextUseCase.execute({
                context: purchase._id.toString()
            });
            return Result.fail(UseCaseError.create('a', 'Error upon distributing to subscriptions'));
        }

        await this.sideEffects(
            coupons, 
            purchase, 
            client!, 
            user, 
            organizationCashierContacts, 
            offerPayments,
            organization,
            payment,
            origin
        );

        return Result.ok({purchaseId: purchase._id});
    }

    private async sideEffects(
        coupons: ICoupon[], 
        purchase: IPurchase, 
        client: IClient, 
        user: IUser, 
        organizationCashierContacts: IContact[], 
        offerPayments: number[],
        organization: IOrganization,
        payment: IPayment,
        origin: string
    ): Promise<Result<true | null, UseCaseError | null>> {
        for (const index in coupons) {
            const purchaseMarketingWithCouponCalculated = await this.calculatePurchaseMarketingUseCase.execute({
                purchase: {
                    ...purchase.toObject(),
                    coupons: [coupons[index]]
                }
            });

            if (purchaseMarketingWithCouponCalculated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon calculating purchase marketing with coupon'));
            }

            const {
                totalSum,
                offerTotalSum
            } = purchaseMarketingWithCouponCalculated.getValue()!;

            coupons[index].quantity--;
            if (coupons[index].quantity <= 0) {
                coupons[index].disabled = true;
            }

            purchase.coupons[index].used = true;
            purchase.confirmed = true;
            purchase.processing = false;

            coupons[index].marketingSum += totalSum; // ?!??!?!?!?!?
            purchase.coupons[index].marketingSum += totalSum; // ?!??!?!?!?!?

            coupons[index].purchaseSum += coupons[index].price;
            purchase.coupons[index].purchaseSum += coupons[index].price;

            coupons[index].offerSum += offerTotalSum;
            purchase.coupons[index].offerSum += offerTotalSum;

            purchase.marketingSum += totalSum;

            if (client) {
                client.purchasesSum += coupons[index].price;
                client.purchasesInOrganization++;
                client.bonusPoints += offerPayments[index];
            }

            const couponSaved = await this.couponRepo.save(coupons[index]);
            if (couponSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving coupon'));
            }
        }

        await this.createOrganizationNotificationUseCase.execute({
            organizationId: organization._id.toString(),
            purchaseId: purchase._id.toString(),
            type: 'purchaseConfirmed'
        });

        // employee.purchasesInOrganization.sum += purchase.sumInPoints;

        await this.sendNotificationUseCase.execute({
            type: 'purchaseConfirmed',
            receiverIds: [user._id.toString()],
            values: {
                sumInPoints: purchase.sumInPoints
            },
            data: {
                purchaseId: purchase._id
            }
        });

        await this.createUserNotificationUseCase.execute({
            level: 'success',
            type: 'purchaseConfirmed',
            userId: user._id.toString(),
            purchaseId: purchase._id.toString()
        });

        this.eventListenerService.dispatchEvent({
            id: user._id.toString(),
            type: 'purchaseConfirmed',
            subject: purchase._id.toString()
        });

        const cashierUserIds: string[] = [];

        // Send event notification to all organization cashier online
        for (const cashierContact of organizationCashierContacts) {
            if (!cashierContact.ref) continue;

            cashierUserIds.push(cashierContact.ref.toString());

            this.eventListenerService.dispatchEvent({
                id: cashierContact.ref.toString(),
                type: 'purchaseConfirmed',
                subject: purchase._id.toString()
            });
        }

        console.log("cashierUserIds", cashierUserIds);

        await this.sendNotificationUseCase.execute({
            app: 'business',
            type: 'purchaseConfirmedBusiness',
            receiverIds: cashierUserIds,
            values: {
                sumInPoints: purchase.sumInPoints,
                purchaseCode: purchase.ref.code
            },
            data: {
                purchaseId: purchase._id
            }
        });

        logger.infoWithMeta('Purchase confirmed', {purchase: purchase.toObject()});

        await this.telegramService.send('purchaseCreated', {
            purchaseCode: purchase.ref.code,
            organizationName: organization.name,
            purchaserName: `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`,
            purchaseSum: purchase.sumInPoints.toFixed(2),
            paymentType: origin,
            paymentSum: payment.sum.toFixed(2),
            bonusSum: payment.usedPoints.toFixed(2),
            paymentDate: new Date().toISOString()
        });

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        if (client) {
            const clientSaved = await this.clientRepo.save(client);
            if (clientSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving client'));
            }
        }
        
        return Result.ok(true);
    }

    private async executeTransactions(
        paymentGatewaySum: number,
        adwiseSum: number, 
        managerSum: number, 
        offerSum: number, 
        organizationPoints: number, 
        userWallet: IWallet, 
        organizationWallet: IWallet, 
        managerWallet: IWallet | undefined, 
        purchase: IPurchase, 
        user: IUser, 
        organization: IOrganization, 
        coupon: {coupon: ICoupon, offerSum: number}, 
        origin: string, 
        globalOrganization: IOrganization
    ): Promise<Result<true | null, UseCaseError | null>> {
        if (managerWallet && coupon.coupon.type != 'service') {
            managerWallet.frozenPoints.push({
                sum: managerSum,
                timestamp: new Date(),
                type: 'bonus'
            });

            const managerWalletSaved = await this.walletRepo.save(managerWallet);
            if (managerWalletSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving manager wallet'));
            }
        }

        let transactionCreated = await this.createTransactionUseCase.execute({
            currency: (managerWallet || organizationWallet).currency,
            from: origin == 'cash' ? organizationWallet._id : undefined as any,
            to: managerWallet?._id,
            type: 'managerPercent',
            sum: managerSum,
            context: purchase._id.toString(),
            organization: organization,
            user: user,
            origin: origin,
            frozen: coupon.coupon.type == 'product'
        }); // 0.25

        if (transactionCreated.isFailure) {
            return Result.fail(transactionCreated.getError());
        }


        transactionCreated = await this.createTransactionUseCase.execute({
            currency: purchase.currency,
            from: origin == 'cash' ? organizationWallet._id : undefined as any,
            to: globalOrganization.wallet.toString(),
            type: 'adwise',
            sum: adwiseSum,
            context: purchase._id.toString(),
            organization: organization,
            user: user,
            origin: origin,
            frozen: coupon.coupon.type == 'product'
        }); // 4.75

        if (transactionCreated.isFailure) {
            return Result.fail(transactionCreated.getError());
        }

        transactionCreated = await this.createTransactionUseCase.execute({
            currency: purchase.currency,
            from: undefined as any,
            to: undefined as any,
            type: 'paymentGateway',
            sum: paymentGatewaySum,
            context: purchase._id.toString(),
            organization: organization,
            user: user,
            origin: origin,
            frozen: coupon.coupon.type == 'product'
        }); // 4.75

        if (transactionCreated.isFailure) {
            return Result.fail(transactionCreated.getError());
        }

        const userWalletSaved = await this.walletRepo.save(userWallet);
        if (userWalletSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user wallet'));
        }

        transactionCreated = await this.createTransactionUseCase.execute({
            currency: userWallet.currency,
            from: origin == 'cash' ? organizationWallet._id : undefined as any,
            to: userWallet._id,
            type: 'offer',
            sum: offerSum,
            context: purchase._id.toString(),
            organization: organization,
            coupon: coupon.coupon,
            user: user,
            origin: origin,
            frozen: coupon.coupon.type == 'product'
        });

        if (transactionCreated.isFailure) {
            return Result.fail(transactionCreated.getError());
        }

        const organizationWalletSaved = await this.walletRepo.save(organizationWallet);
        if (organizationWalletSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization wallet'));
        }

        transactionCreated = await this.createTransactionUseCase.execute({
            currency: organizationWallet.currency,
            from: undefined as any,
            to: organizationWallet._id,
            type: 'purchase',
            sum: organizationPoints,
            context: purchase._id.toString(),
            organization: organization,
            coupon: coupon.coupon,
            user: user,
            origin: origin,
            frozen: false
        });

        if (transactionCreated.isFailure) {
            return Result.fail(transactionCreated.getError());
        }

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok(true);
    }

    private async getKeyObjects(purchaseId: string, resolvedObjects?: ConfirmPurchaseDTO.Request['resolvedObjects']): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        let global: IGlobal;
        if (resolvedObjects?.global) {
            global = resolvedObjects.global;
        } else {
            const globalGotten = await this.globalRepo.getGlobal();
            if (globalGotten.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
            }

            global = globalGotten.getValue()!;
        }

        if (!global.organization) {
            return Result.fail(UseCaseError.create('c', 'There is no global organization'));
        }

        const globalOrganizationFound = await this.organizationRepo.findById(global.organization.toString()!);
        if (globalOrganizationFound.isFailure) {
            return Result.fail(globalOrganizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding global organization') : UseCaseError.create('l'));
        }

        const globalOrganization = globalOrganizationFound.getValue()!;
        
        let purchase: IPurchase;
        if (resolvedObjects?.purchase) {
            purchase = resolvedObjects.purchase;
        } else {
            const purchaseFound = await this.purchaseRepo.findById(purchaseId);
            if (purchaseFound.isFailure) {
                return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
            }

            purchase = purchaseFound.getValue()!;
        }

        let payment: IPayment;
        if (resolvedObjects?.payment) {
            payment = resolvedObjects.payment;
        } else {
            const paymentFound = await this.paymentRepo.findById(purchase.payment.toString());
            if (paymentFound.isFailure) {
                return Result.fail(paymentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('4'));
            }

            payment = paymentFound.getValue()!;
        }

        let organization: IOrganization;
        if (resolvedObjects?.organization) {
            organization = resolvedObjects.organization;
        } else {
            const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }

            organization = organizationFound.getValue()!;
        }

        let manager: IUser | undefined;

        if (organization.manager) {
            const managerFound = await this.userRepo.findById(organization.manager.toString());
            if (managerFound.isSuccess) {
                manager = managerFound.getValue()!;
            }
        }

        let user: IUser;
        if (resolvedObjects?.user) {
            user = resolvedObjects.user;
        } else {
            const userFound = await this.userRepo.findById(purchase.user.toString());
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m', 'Purchaser user does not exist'));
            }

            user = userFound.getValue()!;
        }

        let organizationWallet: IWallet;
        if (resolvedObjects?.organizationWallet) {
            organizationWallet = resolvedObjects.organizationWallet;
        } else {
            const organizationWalletFound = await this.walletRepo.findById(organization.wallet.toString());
            if (organizationWalletFound.isFailure) {
                return Result.fail(organizationWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization wallet') : UseCaseError.create('r', 'Organization wallet does not exist'));
            }

            organizationWallet = organizationWalletFound.getValue()!;
        }

        let managerWallet: IWallet | undefined;

        if (manager) {
            const managerWalletFound = await this.walletRepo.findById(manager.wallet.toString());
            if (managerWalletFound.isSuccess) {
                managerWallet = managerWalletFound.getValue()!;
            }
        }

        let userWallet: IWallet;
        if (resolvedObjects?.userWallet) {
            userWallet = resolvedObjects.userWallet;
        } else {
            const userWalletFound = await this.walletRepo.findById(user.wallet.toString());
            if (userWalletFound.isFailure) {
                return Result.fail(userWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user wallet') : UseCaseError.create('r', 'User wallet does not exist'));
            }

            userWallet = userWalletFound.getValue()!;
        }

        let coupons: ICoupon[] = [];
        if (resolvedObjects?.coupons) {
            coupons = resolvedObjects.coupons;
        } else {
            // const couponIds = purchase.coupons.map(c => c._id.toString());
            // const couponsFound = await this.couponRepo.findByIds(couponIds);
            // if (couponsFound.isFailure) {
            //     return Result.fail(couponsFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
            // }

            // coupons = couponsFound.getValue()!;
            // TEMPORARY
            // for (const coupon of purchase.coupons) {
            //     const couponFound = await this.couponRepo.findById(coupon._id.toString());
            //     if (couponFound.isFailure) {
            //         return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
            //     }

            //     coupons.push(couponFound.getValue()!);
            // }

            coupons = purchase.coupons;
        }

        let client : IClient;
        
        const clientFound = await this.clientRepo.findByOrganizationAndUser(organization._id, user._id);
        if (clientFound.isSuccess) {
            client = clientFound.getValue()!;
        }

        const organizationCashierContactsGotten = await this.getOrganizationCashierContactsUseCase.execute({
            organizationId: organization._id.toString()
        });
        
        if (organizationCashierContactsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting organization cashier contacts'));
        }

        const organizationCashierContacts = organizationCashierContactsGotten.getValue()!.contacts;

        return Result.ok({
            purchase,
            payment,
            managerWallet,
            organizationWallet,
            userWallet,
            organization,
            user,
            coupons,
            client: client!,
            organizationCashierContacts,
            global,
            globalOrganization
        });
    }
}