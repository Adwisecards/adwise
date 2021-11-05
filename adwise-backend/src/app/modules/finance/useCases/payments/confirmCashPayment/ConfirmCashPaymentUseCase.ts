import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { ICoupon } from "../../../../organizations/models/Coupon";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { ConfirmPurchaseUseCase } from "../../purchases/confirmPurchase/ConfirmPurchaseUseCase";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { ConfirmCashPaymentDTO } from "./ConfirmCashPaymentDTO";
import { confirmCashPaymentErrors } from "./confirmCashPaymentErrors";

export class ConfirmCashPaymentUseCase implements IUseCase<ConfirmCashPaymentDTO.Request, ConfirmCashPaymentDTO.Response> {
    private paymentRepo: IPaymentRepo;
    private confirmPurchaseUseCase: ConfirmPurchaseUseCase;
    private createTransactionUseCase: CreateTransactionUseCase;
    private purchaseRepo: IPurchaseRepo;
    private walletRepo: IWalletRepo;
    private organizationRepo: IOrganizationRepo;
    private userRepo: IUserRepo;
    private couponRepo: ICouponRepo;

    public errors = confirmCashPaymentErrors;

    constructor(
        paymentRepo: IPaymentRepo, 
        confirmPurchaseUseCase: ConfirmPurchaseUseCase, 
        createTransactionUseCase: CreateTransactionUseCase, 
        purchaseRepo: IPurchaseRepo, 
        walletRepo: IWalletRepo, 
        organizationRepo: IOrganizationRepo, 
        userRepo: IUserRepo, 
        couponRepo: ICouponRepo,
    ) {
        this.paymentRepo = paymentRepo;
        this.confirmPurchaseUseCase = confirmPurchaseUseCase;
        this.createTransactionUseCase = createTransactionUseCase;
        this.purchaseRepo = purchaseRepo;
        this.walletRepo = walletRepo;
        this.organizationRepo = organizationRepo;
        this.userRepo = userRepo;
        this.couponRepo = couponRepo;
    }

    public async execute(req: ConfirmCashPaymentDTO.Request): Promise<ConfirmCashPaymentDTO.Response> {
        if (!Types.ObjectId.isValid(req.paymentId)) {
            return Result.fail(UseCaseError.create('c', 'paymentId is not valid'));
        }

        const paymentFound = await this.paymentRepo.findById(req.paymentId);
        if (paymentFound.isFailure) {
            return Result.fail(paymentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding payment') : UseCaseError.create('c', 'Payment does not exist'));
        }

        const payment = paymentFound.getValue()!;

        if (payment.paid) {
            return Result.fail(UseCaseError.create('c', 'Payment is already paid'));
        }

        const purchaseFound = await this.purchaseRepo.findById(payment.ref.toString());
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = purchaseFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const userFound = await this.userRepo.findById(purchase.user.toHexString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m', 'User does not exist'));
        }

        const user = userFound.getValue()!;

        const walletFound = await this.walletRepo.findById(user.wallet.toHexString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('r', 'Wallet does not exist'));
        }

        const wallet = walletFound.getValue()!;
        
        let remainingPoints = 0;
        wallet.bonusPoints -= payment.usedPoints;
        if (wallet.bonusPoints < 0) {
            remainingPoints = Math.abs(wallet.bonusPoints);
            wallet.bonusPoints = 0;
        }

        if (remainingPoints) {
            wallet.cashbackPoints -= remainingPoints;
        }

        await this.createTransactionUseCase.execute({
            currency: wallet.currency,
            from: wallet._id,
            to: undefined as any,
            type: 'usedPoints',
            sum: payment.usedPoints,
            context: purchase._id.toString(),
            organization: organization,
            user: user,
            origin: 'cash',
            frozen: false
        });

        await this.createTransactionUseCase.execute({
            currency: wallet.currency,
            from: wallet._id,
            to: undefined as any,
            type: 'payment',
            sum: payment.sum,
            context: purchase._id.toString(),
            organization: organization,
            user: user,
            origin: 'cash',
            frozen: false
        });

        const purchaseConfirmed = await this.confirmPurchaseUseCase.execute({
            purchaseId: payment.ref.toString(),
            cash: true,
            split: false,
            safe: false
        });

        if (purchaseConfirmed.isFailure) {
            console.log(purchaseConfirmed.getError()!);
            return Result.fail(UseCaseError.create('a', 'Error upon confirming purchase'));
        }

        const coupons: ICoupon[] = purchase.coupons;

        // for (const coupon of purchase.coupons) {
        //     const couponFound = await this.couponRepo.findById(coupon._id.toString());
        //     if (couponFound.isFailure) {
        //         return Result.fail(couponFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding coupon') : UseCaseError.create('q'));
        //     }

        //     coupons.push(couponFound.getValue()!);
        // }

        for (const index in coupons) {
            purchase.coupons[index].used = true;
            coupons[index].quantity--;
            if (coupons[index].quantity == 0) {
                coupons[index].disabled = true;
            }

            const couponSaved = await this.couponRepo.save(coupons[index]);
            if (couponSaved.isFailure) {
                console.log(couponSaved.getError());
                return Result.fail(UseCaseError.create('a', 'Error upon saving coupon'));
            }
        }

        const walletSaved = await this.walletRepo.save(wallet);
        if (walletSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving wallet'));
        }

        purchase.payment = payment._id;

        purchase.paidAt = new Date();
        
        await this.purchaseRepo.save(purchase);

        return Result.ok({paymentId: payment._id});
    }
}