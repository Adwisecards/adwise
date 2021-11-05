import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPaymentService } from "../../../../../services/paymentService/IPaymentService";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IAccumulation } from "../../../models/Accumulation";
import { IPayment } from "../../../models/Payment";
import { IPurchase } from "../../../models/Purchase";
import { ITransaction } from "../../../models/Transaction";
import { IWallet } from "../../../models/Wallet";
import { IAccumulationRepo } from "../../../repo/accumulations/IAccumulationRepo";
import { IPaymentRepo } from "../../../repo/payments/IPaymentRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { DisableTransactionUseCase } from "../../transactions/disableTransaction/DisableTransactionUseCase";
import { CalculatePurchaseMarketingUseCase } from "../calculatePurchaseMarketing/CalculatePurchaseMarketingUseCase";
import { CancelPurchaseDTO } from "./CancelPurchaseDTO";
import { cancelPurchaseErrors } from "./cancelPurchaseErrors";

interface IKeyObjects {
    purchase: IPurchase;
    transactions: ITransaction[];
    accumulation?: IAccumulation;
    payment: IPayment;
    organization: IOrganization;
    wallet: IWallet;
    purchaserUser: IUser;
};

export class CancelPurchaseUseCase implements IUseCase<CancelPurchaseDTO.Request, CancelPurchaseDTO.Response> {
    private userRepo: IUserRepo;
    private walletRepo: IWalletRepo;
    private paymentRepo: IPaymentRepo;
    private purchaseRepo: IPurchaseRepo;
    private paymentService: IPaymentService;
    private transactionRepo: ITransactionRepo;
    private accumulationRepo: IAccumulationRepo;
    private organizationRepo: IOrganizationRepo;
    private createTransactionUseCase: CreateTransactionUseCase;
    private disableTransactionUseCase: DisableTransactionUseCase;
    private calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase;

    public errors = cancelPurchaseErrors;

    constructor(
        userRepo: IUserRepo,
        walletRepo: IWalletRepo,
        paymentRepo: IPaymentRepo,
        purchaseRepo: IPurchaseRepo,
        paymentService: IPaymentService,
        transactionRepo: ITransactionRepo,
        accumulationRepo: IAccumulationRepo,
        organizationRepo: IOrganizationRepo,
        createTransactionUseCase: CreateTransactionUseCase,
        disableTransactionUseCase: DisableTransactionUseCase,
        calculatePurchaseMarketingUseCase: CalculatePurchaseMarketingUseCase
    ) {
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.paymentRepo = paymentRepo;
        this.purchaseRepo = purchaseRepo;
        this.paymentService = paymentService;
        this.transactionRepo = transactionRepo;
        this.accumulationRepo = accumulationRepo;
        this.organizationRepo = organizationRepo;
        this.createTransactionUseCase = createTransactionUseCase;
        this.disableTransactionUseCase = disableTransactionUseCase;
        this.calculatePurchaseMarketingUseCase = calculatePurchaseMarketingUseCase;
    }

    public async execute(req: CancelPurchaseDTO.Request): Promise<CancelPurchaseDTO.Response> {
        if (!Types.ObjectId.isValid(req.purchaseId)) {
            return Result.fail(UseCaseError.create('c', 'purchaseId is not valid'));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.purchaseId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            purchase,
            transactions,
            accumulation,
            payment,
            organization,
            wallet,
            purchaserUser
        } = keyObjectsGotten.getValue()!;

        if (!purchase.confirmed) {
            return Result.fail(UseCaseError.create('c', 'Purchase is not confirmed'));
        }

        if (purchase.canceled) {
            return Result.fail(UseCaseError.create('c', 'Purchase is already canceled'));
        }

        const purchaseCanceled = await this.cancelPurchase(!!req.internal, purchase, transactions, payment, organization, wallet, purchaserUser, accumulation);
        if (purchaseCanceled.isFailure) {
            return Result.fail(purchaseCanceled.getError()!);
        }

        return Result.ok({purchaseId: req.purchaseId});
    }

    private async cancelPurchase(internal: boolean, purchase: IPurchase, transactions: ITransaction[], payment: IPayment, organization: IOrganization, wallet: IWallet, purchaserUser: IUser, accumulation?: IAccumulation): Promise<Result<true | null, UseCaseError | null>> {
        const origin = payment.cash ? 'cash' : (payment.split ? 'split' : (payment.safe ? 'safe' : 'default'));
        
        purchase.canceled = true;
        purchase.archived = true;

        if (origin == 'cash') {
            await this.createTransactionUseCase.execute({
                currency: wallet.currency,
                from: undefined as any,
                to: purchaserUser.wallet.toString(),
                type: 'correct',
                sum: payment.sum,
                user: purchaserUser,
                organization: organization,
                context: purchase._id.toString(),
                origin: 'cash',
                frozen: false
            });
        } else if (internal) {
            const paymentCanceled = await this.paymentService.cancelPayment(payment.paymentId, payment.sum*100, origin);
            if (paymentCanceled.isFailure) {

                return Result.fail(UseCaseError.create('a', 'Error upon canceling payment'));
            }
        }

        let disableCorrect = true;

        if (payment.safe || payment.split) {
            disableCorrect = false;
        }

        if (accumulation && !accumulation.closed && accumulation.sum > payment.sum) {
            disableCorrect = true;
            accumulation.sum -= payment.sum;

            const accumulationSaved = await this.accumulationRepo.save(accumulation);
            if (accumulationSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving accumulation'));
            }
        }

        if (accumulation && accumulation.closed) {
            disableCorrect = false;
            const purchaseMarketingCalculated = await this.calculatePurchaseMarketingUseCase.execute({
                purchase
            });

            if (purchaseMarketingCalculated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon calculating purchase marketing'));
            }

            const {
                totalSum
            } = purchaseMarketingCalculated.getValue()!;

            const correctSum = purchase.sumInPoints - totalSum;

            await this.createTransactionUseCase.execute({
                currency: wallet.currency,
                from: wallet._id,
                to: undefined as any,
                type: 'correct',
                sum: correctSum,
                user: purchaserUser,
                organization: organization,
                context: purchase._id.toString(),
                origin: 'safe',
                frozen: false
            });

            await this.createTransactionUseCase.execute({
                currency: wallet.currency,
                from: undefined as any,
                to: purchaserUser.wallet.toString(),
                type: 'correct',
                sum: correctSum,
                user: purchaserUser,
                organization: organization,
                context: purchase._id.toString(),
                origin: 'safe',
                frozen: false
            });
        }

        for (const transaction of transactions) {
            if (!disableCorrect && transaction.type == 'correct') {
                continue;
            }

            await this.disableTransactionUseCase.execute({
                disabled: true,
                transactionId: transaction._id
            });
        }

        const purchaseSaved = await this.purchaseRepo.save(purchase);
        if (purchaseSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
        }

        return Result.ok(true);
    }

    private async getKeyObjects(purchaseId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const purchaseFound = await this.purchaseRepo.findById(purchaseId);
        if (purchaseFound.isFailure) {
            return Result.fail(purchaseFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchase') : UseCaseError.create('s'));
        }

        const purchase = purchaseFound.getValue()!;

        const transactionsFound = await this.transactionRepo.findByContexts([purchase._id.toString()]);
        if (transactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const transactions = transactionsFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const paymentFound = await this.paymentRepo.findById(purchase.payment.toString());
        if (paymentFound.isFailure) {
            return Result.fail(paymentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding payment') : UseCaseError.create('4'));
        } 

        const payment = paymentFound.getValue()!;

        const accumulationFound = await this.accumulationRepo.findByPayment(payment._id.toString());
        if (accumulationFound.isFailure && accumulationFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding accumulation'));
        }

        const accumulation = accumulationFound.isSuccess ? accumulationFound.getValue()! : null;

        const walletFound = await this.walletRepo.findById(organization.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        const purchaserUserFound = await this.userRepo.findById(purchase.user.toString());
        if (purchaserUserFound.isFailure) {
            return Result.fail(purchaserUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding purchaser user') : UseCaseError.create('m', 'Purchaser user does not exist'));
        }

        const purchaserUser = purchaserUserFound.getValue()!;

        return Result.ok({
            purchase,
            transactions,
            accumulation: accumulation!,
            payment,
            organization,
            wallet,
            purchaserUser
        });
    }
}