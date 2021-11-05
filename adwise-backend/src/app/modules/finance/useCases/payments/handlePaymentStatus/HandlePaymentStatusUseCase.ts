import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPaymentService } from "../../../../../services/paymentService/IPaymentService";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { IOrganization } from "../../../../organizations/models/Organization";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPayment } from "../../../models/Payment";
import { IPurchase } from "../../../models/Purchase";
import { ITips } from "../../../models/Tips";
import { IWallet } from "../../../models/Wallet";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ITipsRepo } from "../../../repo/tips/ITipsRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { AccumulatePaymentUseCase } from "../../accumulations/accumulatePayment/AccumulatePaymentUseCase";
import { CalculatePurchaseMarketingUseCase } from "../../purchases/calculatePurchaseMarketing/CalculatePurchaseMarketingUseCase";
import { CancelPurchaseUseCase } from "../../purchases/cancelPurchase/CancelPurchaseUseCase";
import { ConfirmPurchaseUseCase } from "../../purchases/confirmPurchase/ConfirmPurchaseUseCase";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { DisableTransactionsWithContextUseCase } from "../../transactions/disableTransactionsWithContext/DisableTransactionsWithContextUseCase";
import { ConfirmPaymentUseCase } from "../confirmPayment/ConfirmPaymentUseCase";
import { HandlePaymentStatusDTO } from "./HandlePaymentStatusDTO";
import { handlePaymentStatusErrors } from "./handlePaymentStatusErrors";

interface IPurchaseKeyObjects {
    purchase: IPurchase;
    coupons: ICoupon[];
    organization: IOrganization;
    organizationWallet: IWallet;
    user: IUser;
    userWallet: IWallet;
    global: IGlobal;
};

interface ITipsKeyObjects {
    tips: ITips;
    purchase?: IPurchase;
    organization: IOrganization;
    purchaserUser?: IUser;
    cashierUser: IUser;
    cashierWallet: IWallet;
};

export class HandlePaymentStatusUseCase implements IUseCase<HandlePaymentStatusDTO.Request, HandlePaymentStatusDTO.Response> {
    private paymentRepo: IPaymentRepo;
    private confirmPurchaseUseCase: ConfirmPurchaseUseCase;
    private paymentService: IPaymentService;
    private purchaseRepo: IPurchaseRepo;
    private walletRepo: IWalletRepo;
    private userRepo: IUserRepo;
    private couponRepo: ICouponRepo;
    private createTransactionUseCase: CreateTransactionUseCase;
    private organizationRepo: IOrganizationRepo
    private globalRepo: IGlobalRepo;
    private tipsRepo: ITipsRepo;
    private calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase;
    private cancelPurchaseUseCase: CancelPurchaseUseCase;
    private accumulatePaymentUseCase: AccumulatePaymentUseCase;
    private disableTransactionsWithContextUseCase: DisableTransactionsWithContextUseCase;

    public errors = [
        ...handlePaymentStatusErrors
    ];

    constructor(
        paymentRepo: IPaymentRepo, 
        confirmPurchaseUseCase: ConfirmPurchaseUseCase, 
        paymentService: IPaymentService, 
        purchaseRepo: IPurchaseRepo, 
        walletRepo: IWalletRepo, 
        userRepo: IUserRepo, 
        couponRepo: ICouponRepo, 
        createTransactionUseCase: CreateTransactionUseCase, 
        organizationRepo: IOrganizationRepo, 
        globalRepo: IGlobalRepo, 
        tipsRepo: ITipsRepo, 
        calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase,
        cancelPurchaseUseCase: CancelPurchaseUseCase,
        accumulatePaymentUseCase: AccumulatePaymentUseCase,
        disableTransactionsWithContextUseCase: DisableTransactionsWithContextUseCase
    ) {
        this.paymentRepo = paymentRepo;
        this.confirmPurchaseUseCase = confirmPurchaseUseCase;
        this.paymentService = paymentService;
        this.purchaseRepo = purchaseRepo;
        this.walletRepo = walletRepo;
        this.couponRepo = couponRepo;
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.createTransactionUseCase = createTransactionUseCase;
        this.globalRepo = globalRepo;
        this.tipsRepo = tipsRepo;
        this.calculatePurchaseMarketingUseCase = calculatePurchaseMarketingUseCase;
        this.cancelPurchaseUseCase = cancelPurchaseUseCase;
        this.accumulatePaymentUseCase = accumulatePaymentUseCase;
        this.disableTransactionsWithContextUseCase = disableTransactionsWithContextUseCase;
    }

    public async execute(req: HandlePaymentStatusDTO.Request): Promise<HandlePaymentStatusDTO.Response> {
        console.log(req);
        if (!req.metadata.id) {
            return Result.fail(UseCaseError.create('c', 'Metadata does not contain id'));
        }

        const paymentFound = await this.paymentRepo.findById(req.metadata.id);
        if (paymentFound.isFailure) {
            return Result.fail(paymentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding payment') : UseCaseError.create('4'));
        }

        const payment = paymentFound.getValue()!;

        try {
            if (req.event == this.paymentService.successfulStatus) {
                return await this.successfulScenario(payment, req);
            } else if (req.event == this.paymentService.canceledStatus) {
                return await this.cancellationScenario(payment);
            } else {
                // TEMP
                return Result.ok({success: true});
            }
        } catch (ex) {
            console.log(ex);

            return Result.ok({success: true});
        }
    }

    private async cancellationScenario(payment: IPayment): Promise<HandlePaymentStatusDTO.Response> {
        payment.canceled = true;
        
        const paymentSaved = await this.paymentRepo.save(payment);
        if (paymentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving payment'));
        }

        if (payment.type == 'purchase') {
            return await this.cancelPurchase(payment);
        } else {
            return Result.ok({success: true});
        }
    }

    private async cancelPurchase(payment: IPayment): Promise<HandlePaymentStatusDTO.Response> {
        const purchaseFound = await this.purchaseRepo.findById(payment.ref.toString());
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = purchaseFound.getValue()!;

        const purchaseCanceled = await this.cancelPurchaseUseCase.execute({
            purchaseId: purchase._id.toString(),
            internal: false
        });

        if (purchaseCanceled.isFailure) {
            if (purchaseCanceled.getError()!.code == 'c') {
                return Result.ok({success: true});
            }

            return Result.fail(UseCaseError.create('a', 'Error upon canceling purchase'));
        }

        return Result.ok({success: true});
    }

    private async successfulScenario(payment: IPayment, req: HandlePaymentStatusDTO.Request): Promise<HandlePaymentStatusDTO.Response> {
        const paymentChecked = this.checkPayment(payment, req);

        if (paymentChecked.isFailure) {
            return Result.ok({success: true});
        }

        if (payment.safe && req.SpAccumulationId) {
            const userGotten = await this.getUserFromPayment(payment);
            if (userGotten.isFailure) {
                return Result.fail(userGotten.getError());
            }

            const user = userGotten.getValue()!;

            const paymentAccumulated = await this.accumulatePaymentUseCase.execute({
                accumulationId: req.SpAccumulationId,
                sum: Number(payment.sum),
                type: payment.type == 'purchase' ? 'purchase' : 'tips',
                userId: user._id.toString(),
                paymentId: payment._id.toString()
            });

            if (paymentAccumulated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon accumulating payment'));
            }

            const { accumulation } = paymentAccumulated.getValue()!;

            payment.accumulation = accumulation._id;
        }

        const paymentSaved = await this.paymentRepo.save(payment);
        if (paymentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving payment'));
        }

        if (payment.type == 'purchase') {
            const purchaseHandled = await this.handlePurchase(payment); 
            if (purchaseHandled.isFailure) {
                await this.disableTransactionsWithContextUseCase.execute({
                    context: payment.ref.toString()
                });
            }
            
            return purchaseHandled;
        } else {
            return await this.handleTips(payment);
        }
    }

    private async sideEffects(payment: IPayment, purchase?: IPurchase): Promise<Result<true | null, UseCaseError | null>> {
        payment.paid = true;

        const paymentSaved = await this.paymentRepo.save(payment);
        if (paymentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving payment'));
        }

        if (!purchase) return Result.ok(true);
        
        purchase.payment = payment._id;
        purchase.paidAt = new Date();

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        return Result.ok(true);
    }

    private async handlePurchase(payment: IPayment): Promise<HandlePaymentStatusDTO.Response> {
        const purchaseKeyObjectsGotten = await this.getPurchaseKeyObjects(payment);
        if (purchaseKeyObjectsGotten.isFailure) {
            return Result.fail(purchaseKeyObjectsGotten.getError());
        }

        const {
            organization,
            organizationWallet,
            purchase,
            user,
            userWallet,
            coupons,
            global
        } = purchaseKeyObjectsGotten.getValue()!;

        if (purchase.confirmed || purchase.complete) {
            return Result.fail(UseCaseError.create('c', 'Purchase is already confirmed'));
        }

        for (const coupon of coupons) {
            if (coupon.disabled) {
                return Result.fail(UseCaseError.create('c', 'Coupon is disabled'));
            }
        }

        const origin = payment.safe ? 'safe' : (payment.split ? 'split' : 'online');
    
        let remainingPoints = 0;
        userWallet.bonusPoints -= payment.usedPoints;
        if (userWallet.bonusPoints < 0) {
            remainingPoints = Math.abs(userWallet.bonusPoints);
            userWallet.bonusPoints = 0;
        }

        if (remainingPoints) {
            userWallet.cashbackPoints -= remainingPoints;
        }

        const commonTransactionsExecuted = await this.executeCommonTransactions(userWallet, purchase, organization, user, payment.sum, payment.usedPoints, origin);
        if (commonTransactionsExecuted.isFailure) {
            return Result.fail(commonTransactionsExecuted.getError());
        }

        const purchaseConfirmed = await this.confirmPurchaseUseCase.execute({
            purchaseId: purchase._id.toString(),
            cash: false,
            safe: origin == 'safe',
            split: origin == 'split',
            resolvedObjects: {
                coupons: coupons,
                global: global,
                organization: organization,
                organizationWallet: organizationWallet,
                purchase: purchase,
                payment: payment,
                user: user,
                userWallet: userWallet
            }
        });

        if (purchaseConfirmed.isFailure) {
            console.log(purchaseConfirmed.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon confirming payment'));
        }

        await this.sideEffects(payment, purchase);

        if (origin == 'split') {
            return await this.handleSplitPurchase(payment, purchase, organizationWallet, organization, user);
        } else if (origin == 'online') {
            return await this.handleSafePurchase();
        }

        return Result.ok({success: true});
    }

    private async handleSplitPurchase(payment: IPayment, purchase: IPurchase, organizationWallet: IWallet, organization: IOrganization, user: IUser): Promise<HandlePaymentStatusDTO.Response> {
        const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({
            purchase: purchase
        });

        if (purchaseMarketingCalculated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon calculating purchase marketing'));
        }

        const {
            totalSum
        } = purchaseMarketingCalculated.getValue()!;

        const organizationPoints = purchase.sumInPoints - totalSum;

        if (payment.sum > organizationPoints) {
            organizationWallet.points -= organizationPoints;
            let transactionCreated = await this.createTransactionUseCase.execute({
                currency: organizationWallet.currency,
                from: organizationWallet._id.toString(),
                to: undefined as any,
                type: 'correct',
                sum: organizationPoints,
                context: purchase._id.toString(),
                organization: organization,
                user: user,
                origin: 'split',
                frozen: false
            });

            if (transactionCreated.isFailure) {
                return Result.fail(transactionCreated.getError());
            }
        }

        const organizationWalletSaved = await this.walletRepo.save(organizationWallet);
        if (organizationWalletSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization wallet'));
        }

        return Result.ok({success: true});
    }

    private async handleSafePurchase(): Promise<HandlePaymentStatusDTO.Response> {
        return Result.ok({success: true});
    }

    private async executeCommonTransactions(userWallet: IWallet, purchase: IPurchase, organization: IOrganization, user: IUser, sum: number, usedPoints: number, origin: string): Promise<Result<true | null, UseCaseError | null>> {
        let transactionCreated = await this.createTransactionUseCase.execute({
            currency: userWallet.currency,
            from: userWallet._id,
            to: undefined as any,
            type: 'usedPoints',
            sum: usedPoints,
            context: purchase._id.toString(),
            organization: organization,
            user: user,
            origin: origin,
            frozen: false
        });

        if (transactionCreated.isFailure) {
            return Result.fail(transactionCreated.getError());
        }
        
        transactionCreated = await this.createTransactionUseCase.execute({
            currency: userWallet.currency,
            from: userWallet._id,
            to: undefined as any,
            type: 'payment',
            sum: sum,
            context: purchase._id.toString(),
            organization: organization,
            user: user,
            origin: origin,
            frozen: false
        });

        if (transactionCreated.isFailure) {
            return Result.fail(transactionCreated.getError());
        }

        return Result.ok(true);
    }

    private async getPurchaseKeyObjects(payment: IPayment): Promise<Result<IPurchaseKeyObjects | null, UseCaseError | null>> {
        const purchaseFound = await this.purchaseRepo.findById(payment.ref.toString());
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = purchaseFound.getValue()!;

        // const couponIds = purchase.coupons.map(c => c._id.toString());

        // const couponsFound = await this.couponRepo.findByIds(couponIds);
        // if (couponsFound.isFailure) {
        //     return Result.fail(couponsFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
        // }

        // const coupons = couponsFound.getValue()!;

        // TEMPORARY
        const coupons: ICoupon[] = purchase.coupons;

        // for (const coupon of purchase.coupons) {
        //     const couponFound = await this.couponRepo.findById(coupon._id.toString());
        //     if (couponFound.isFailure) {
        //         return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('p'));
        //     }

        //     coupons.push(couponFound.getValue()!);
        // }

        const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
        if (organizationFound.isFailure) {
           return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }
        
        const organization = organizationFound.getValue()!;

        const userFound = await this.userRepo.findById(purchase.user.toString());
        if (userFound.isFailure) {
           return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }
        
        const user = userFound.getValue()!;

        const organizationWalletFound = await this.walletRepo.findById(organization.wallet.toString());
        if (organizationWalletFound.isFailure) {
            return Result.fail(organizationWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization wallet') : UseCaseError.create('r'));
        }

        const organizationWallet = organizationWalletFound.getValue()!;

        const userWalletFound = await this.walletRepo.findById(user.wallet.toString());
        if (userWalletFound.isFailure) {
            return Result.fail(userWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user wallet') : UseCaseError.create('r'));
        }

        const userWallet = userWalletFound.getValue()!;

        const globalGotten = await this.globalRepo.getGlobal()!;
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        return Result.ok({
            coupons,
            organization,
            organizationWallet,
            purchase,
            user,
            userWallet,
            global
        });
    }

    private async handleTips(payment: IPayment): Promise<HandlePaymentStatusDTO.Response> {
        const keyObjectsGotten = await this.getTipsKeyObjects(payment);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            cashierUser,
            cashierWallet,
            organization,
            tips,
            purchase,
            purchaserUser
        } = keyObjectsGotten.getValue()!;

        if (purchase) {
            purchase.tips = true;

            const purchaseSaved = await this.purchaseRepo.save(purchase);
            if (purchaseSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
            }
        }

        const transactionCreated = await this.createTransactionUseCase.execute({
            currency: cashierWallet.currency,
            from: purchaserUser?.wallet.toHexString() as any,
            to: undefined as any,
            type: 'payment',
            sum: payment.sum,
            context: tips._id.toString(),
            user: purchaserUser as any,
            origin: 'safe',
            frozen: false
        });

        if (transactionCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating transaction'));
        }

        tips.confirmed = true;
        tips.processing = false;

        const walletSaved = await this.walletRepo.save(cashierWallet);
        if (walletSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving wallet'));
        }

        const tipsSaved = await this.tipsRepo.save(tips);
        if (tipsSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving wallet'));
        }

        await this.paymentRepo.save(payment);

        await this.sideEffects(payment);

        return Result.ok({success: true});
    } 

    private async getTipsKeyObjects(payment: IPayment): Promise<Result<ITipsKeyObjects | null, UseCaseError | null>> {
        const tipsFound = await this.tipsRepo.findById(payment.ref.toString());
        if (tipsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding tips'))
        }

        const tips = tipsFound.getValue()!;

        let purchase: IPurchase;
        
        if (tips.purchase) {
            const purchaseFound = await this.purchaseRepo.findById(tips.purchase.toString());
            if (purchaseFound.isFailure) {
                return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
            }
            
            purchase = purchaseFound.getValue()!;
        }

        const organizationFound = await this.organizationRepo.findById(tips.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        let purchaserUser: IUser;

        if (tips.from) {
            const purchaserUserFound = await this.userRepo.findById(tips.from.toString());
            if (purchaserUserFound.isFailure) {
                return Result.fail(purchaserUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchaser user') : UseCaseError.create('m'));
            }

            purchaserUser = purchaserUserFound.getValue()!;
        }

        const cashierUserFound = await this.userRepo.findById(tips.to.toString());
        if (cashierUserFound.isFailure) {
            return Result.fail(cashierUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding cashier user') : UseCaseError.create('m'));
        }

        const cashierUser = cashierUserFound.getValue()!;

        const cashierWalletFound = await this.walletRepo.findById(cashierUser.wallet.toString());
        if (cashierWalletFound.isFailure) {
            return Result.fail(cashierWalletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding cashier wallet') : UseCaseError.create('r'));
        }

        const cashierWallet = cashierWalletFound.getValue()!;

        return Result.ok({
            cashierUser,
            cashierWallet,
            organization,
            tips,
            purchase: purchase!,
            purchaserUser: purchaserUser!
        })
    }

    private checkPayment(payment: IPayment, req: any): Result<true | null, UseCaseError | null> {
        if (payment.paid && payment.confirmed) {
            return Result.fail(UseCaseError.create('c', 'Payment is already paid and confirmed'));
        }

        if (payment.paid) {
            return Result.fail(UseCaseError.create('c', 'Payment is already paid'));
        }

        if (payment.canceled) {
            return Result.fail(UseCaseError.create('c', 'Payment is canceled'));
        }

        if (payment.sum-1 > req.amount.value) {
            return Result.fail(UseCaseError.create('c', 'Payment is not satisfied'));
        }

        return Result.ok(true);
    }

    private async getUserFromPayment(payment: IPayment): Promise<Result<IUser | null, UseCaseError | null>> {
        let user: IUser;

        if (payment.type == 'purchase') {
            const purchaseFound = await this.purchaseRepo.findById(payment.ref.toString());
            if (purchaseFound.isFailure) {
                return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'))
            }

            const purchase = purchaseFound.getValue()!;

            const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }

            const organization = organizationFound.getValue()!;

            const userFound = await this.userRepo.findById(organization.user.toString());
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
            }

            user = userFound.getValue()!;
        } else {
            const tipsFound = await this.tipsRepo.findById(payment.ref.toString());
            if (tipsFound.isFailure) {
                return Result.fail(tipsFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding tips') : UseCaseError.create('6'));
            }

            const tips = tipsFound.getValue()!;
            
            const userFound = await this.userRepo.findById(tips.to.toString());
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
            }

            user = userFound.getValue()!;
        }

        return Result.ok(user);
    }
}