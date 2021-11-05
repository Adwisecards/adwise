import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPaymentService } from "../../../../../services/paymentService/IPaymentService";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { ICouponRepo } from "../../../../organizations/repo/coupons/ICouponRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IAccumulation } from "../../../models/Accumulation";
import { IPayment } from "../../../models/Payment";
import { IAccumulationRepo } from "../../../repo/accumulations/IAccumulationRepo";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ITipsRepo } from "../../../repo/tips/ITipsRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { CalculatePurchaseMarketingUseCase } from "../../purchases/calculatePurchaseMarketing/CalculatePurchaseMarketingUseCase";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { ConfirmPaymentDTO } from "./ConfirmPaymentDTO";
import { confirmPaymentErrors } from "./confirmPaymentErrors";

export class ConfirmPaymentUseCase implements IUseCase<ConfirmPaymentDTO.Request, ConfirmPaymentDTO.Response> {
    private paymentRepo: IPaymentRepo;
    private paymentService: IPaymentService;
    private globalRepo: IGlobalRepo;
    private tipsRepo: ITipsRepo;
    private userRepo: IUserRepo;
    private createTransactionUseCase: CreateTransactionUseCase;
    private walletRepo: IWalletRepo;
    private purchaseRepo: IPurchaseRepo;
    private organizationRepo: IOrganizationRepo;
    private accumulationRepo: IAccumulationRepo;
    private calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase;

    public errors = confirmPaymentErrors;

    constructor(
        paymentRepo: IPaymentRepo, 
        paymentService: IPaymentService, 
        globalRepo: IGlobalRepo, 
        tipsRepo: ITipsRepo, 
        userRepo: IUserRepo, 
        createTransactionUseCase: CreateTransactionUseCase, 
        walletRepo: IWalletRepo, 
        purchaseRepo: IPurchaseRepo, 
        organizationRepo: IOrganizationRepo, 
        accumulationRepo: IAccumulationRepo, 
        calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase
    ) {
        this.paymentRepo = paymentRepo;
        this.paymentService = paymentService;
        this.globalRepo = globalRepo;
        this.tipsRepo = tipsRepo;
        this.userRepo = userRepo;
        this.createTransactionUseCase = createTransactionUseCase;
        this.walletRepo = walletRepo;
        this.purchaseRepo = purchaseRepo;
        this.organizationRepo = organizationRepo;
        this.accumulationRepo = accumulationRepo;
        this.calculatePurchaseMarketingUseCase = calculatePurchaseMarketingUseCase;
    }

    public async execute(req: ConfirmPaymentDTO.Request): Promise<ConfirmPaymentDTO.Response> {
        if (!Types.ObjectId.isValid(req.paymentId)) {
            return Result.fail(UseCaseError.create('c', 'paymentId is not valid'));
        }

        const paymentFound = await this.paymentRepo.findById(req.paymentId);
        if (paymentFound.isFailure) {
            return Result.fail(paymentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding payment') : UseCaseError.create('4'));
        }

        const payment = paymentFound.getValue()!;

        if (!payment.paid) {
            return Result.fail(UseCaseError.create('c', 'Payment is not complete'));
        }

        if (!payment.accumulation) {
            return Result.fail(UseCaseError.create('4', 'Payment does not have accumulation'));
        }

        if (!payment.safe) {
            return Result.fail(UseCaseError.create('c', 'Payment is of inappropriate type'));
        }

        if (payment.confirmed) {
            return Result.fail(UseCaseError.create('c', 'Payment is already confirmed'));
        }

        const globalFound = await this.globalRepo.getGlobal();
        if (globalFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalFound.getValue()!;

        if (!global.organization) {
            return Result.fail(UseCaseError.create('c', 'There is no global organization'));
        }

        const accumulationFound = await this.accumulationRepo.findById(payment.accumulation.toString());
        if (accumulationFound.isFailure) {
            return Result.fail(accumulationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding accumulation') : UseCaseError.create('7'));
        }

        const accumulation = accumulationFound.getValue()!;

        if (accumulation.sum < global.minimalPayment) {
            return Result.fail(UseCaseError.create('c', 'Accumulated sum is not sufficient'));
        }

        if (payment.type == 'tips') {
            return this.confirmTipsPayment(payment, accumulation, global);
        }

        return this.confirmPurchasePayment(payment, accumulation);
    }

    private async confirmPurchasePayment(payment: IPayment, accumulation: IAccumulation): Promise<ConfirmPaymentDTO.Response> {
        const purchaseFound = await this.purchaseRepo.findById(payment.ref.toString());
        if (purchaseFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchase'));
        }

        const purchase = purchaseFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization'));
        }

        const organization = organizationFound.getValue()!;

        const organizationUserFound = await this.userRepo.findById(organization.user.toString());
        if (organizationUserFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization user'));
        }

        const organizationUser = organizationUserFound.getValue()!;

        if (!organizationUser.paymentCardId) {
            return Result.fail(UseCaseError.create('c', 'Organization has no card'));
        }

        const walletFound = await this.walletRepo.findById(organization.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding wallet'));
        }

        const wallet = walletFound.getValue()!;

        const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({purchase});
        if (purchaseMarketingCalculated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon calculating purchase marketing'));
        }

        const {
            totalSum
        } = purchaseMarketingCalculated.getValue()!;


        const organizationMoney = purchase.sumInPoints - totalSum; // 845

        const realMoney = payment.sum; // 583

        let moneyToPay = organizationMoney;

        if (realMoney < organizationMoney) {
            moneyToPay = realMoney; // 583
            //debtToOrganization -= moneyToPay; // 262
        }

        moneyToPay = Number(moneyToPay.toFixed(2));

        console.log('\n',moneyToPay,'\n', payment, '\n')
        
        const paymentInitiated = await this.paymentService.initPaymentSafe(moneyToPay, 'rub', payment._id, accumulation.accumulationId, organizationUser.paymentCardId);
        if (paymentInitiated.isFailure) {
            console.log(paymentInitiated.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon initiating payment'));
        }

        const servicePayment = paymentInitiated.getValue()!;
        
        const paymentConfirmed = await this.paymentService.confirmPaymentSafe(servicePayment.id);
        if (paymentConfirmed.isFailure) {
            console.log(paymentConfirmed.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon confirming payment'));
        }

        payment.confirmed = true;

        const paymentSaved = await this.paymentRepo.save(payment);
        if (paymentSaved.isFailure) {
            paymentSaved.getError();
            return Result.fail(UseCaseError.create('a', 'Error upon saving payment'));
        }

        await this.createTransactionUseCase.execute({
            currency: wallet.currency,
            from: wallet._id,
            to: undefined as any,
            type: 'correct',
            sum: moneyToPay,
            user: organizationUser,
            organization: organization,
            context: purchase._id,
            origin: 'safe',
            frozen: false
        });

        return Result.ok({payment});
    }

    private async confirmTipsPayment(payment: IPayment, accumulation: IAccumulation, global: IGlobal): Promise<ConfirmPaymentDTO.Response> {   
        const globalOrganizationFound = await this.organizationRepo.findById(global.organization.toString());
        if (globalOrganizationFound.isFailure) {
            return Result.fail(globalOrganizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding global organization') : UseCaseError.create('l'));
        }

        const globalOrganization = globalOrganizationFound.getValue()!;

        const tipsFound = await this.tipsRepo.findById(payment.ref.toString());
        if (tipsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding tips'));
        }

        const tips = tipsFound.getValue()!;

        const receiverUserFound = await this.userRepo.findById(tips.to.toString());
        if (receiverUserFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
        }

        const receiverUser = receiverUserFound.getValue()!;

        if (!receiverUser.paymentCardId) {
            return Result.fail(UseCaseError.create('c', 'Receiver user has no card'));
        }

        const walletFound = await this.walletRepo.findById(receiverUser.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding wallet'));
        }

        const wallet = walletFound.getValue()!;

        const adwiseSum = payment.sum * (global.purchasePercent / 100);

        await this.createTransactionUseCase.execute({
            currency: wallet.currency,
            from: undefined as any,
            to: globalOrganization.wallet.toString(),
            type: 'adwise',
            sum: adwiseSum,
            user: receiverUser,
            context: tips._id,
            origin: 'safe',
            frozen: false
        });

        const sum = payment.sum - adwiseSum;

        await this.createTransactionUseCase.execute({
            currency: wallet.currency,
            from: undefined as any,
            to: wallet._id,
            type: 'tips',
            sum: sum,
            user: receiverUser,
            context: tips._id,
            origin: 'safe',
            frozen: false
        });

        const paymentInitiated = await this.paymentService.initPaymentSafe(sum, 'rub', payment._id, accumulation.accumulationId, receiverUser.paymentCardId);
        if (paymentInitiated.isFailure) {
            console.log(paymentInitiated.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon initiating payment'));
        }

        const servicePayment = paymentInitiated.getValue()!;
        
        const paymentConfirmed = await this.paymentService.confirmPaymentSafe(servicePayment.id);
        if (paymentConfirmed.isFailure) {
            console.log(paymentConfirmed.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon confirming payment'));
        }

        payment.confirmed = true;

        const paymentSaved = await this.paymentRepo.save(payment);
        if (paymentSaved.isFailure) {
            paymentSaved.getError();
            return Result.fail(UseCaseError.create('a', 'Error upon saving payment'));
        }

        return Result.ok({payment});
    }
}