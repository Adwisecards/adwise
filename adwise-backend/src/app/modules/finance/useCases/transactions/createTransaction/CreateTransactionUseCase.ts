import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { logger } from "../../../../../services/logger";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { CouponModel } from "../../../../organizations/models/Coupon";
import { OrganizationModel } from "../../../../organizations/models/Organization";
import { CreateRefUseCase } from "../../../../ref/useCases/createRef/CreateRefUseCase";
import { UserModel } from "../../../../users/models/User";
import { PurchaseModel } from "../../../models/Purchase";
import { TransactionModel } from "../../../models/Transaction";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { RecalculateWalletBalanceUseCase } from "../../wallets/recalculateWalletBalance/RecalculateWalletBalanceUseCase";
import { DisableTransactionsWithContextUseCase } from "../disableTransactionsWithContext/DisableTransactionsWithContextUseCase";
import { CreateTransactionDTO } from "./CreateTransactionDTO";
import { createTransactionErrors } from "./createTransactionErrors";

export class CreateTransactionUseCase implements IUseCase<CreateTransactionDTO.Request, CreateTransactionDTO.Response> {
    private transactionRepo: ITransactionRepo;
    private createRefUseCase: CreateRefUseCase;
    private recalculateWalletBalanceUseCase: RecalculateWalletBalanceUseCase;
    private disableTransactionsWithContext: DisableTransactionsWithContextUseCase;
    private globalRepo: IGlobalRepo;

    public errors: UseCaseError[] = [
        ...createTransactionErrors
    ];
    constructor(
        transactionRepo: ITransactionRepo, 
        createRefUseCase: CreateRefUseCase, 
        recalculateWalletBalanceUseCase: RecalculateWalletBalanceUseCase,
        disableTransactionsWithContext: DisableTransactionsWithContextUseCase,
        globalRepo: IGlobalRepo
    ) {
        this.transactionRepo = transactionRepo;
        this.createRefUseCase = createRefUseCase;
        this.recalculateWalletBalanceUseCase = recalculateWalletBalanceUseCase;
        this.disableTransactionsWithContext = disableTransactionsWithContext;
        this.globalRepo = globalRepo;
    }

    public async execute(req: CreateTransactionDTO.Request): Promise<CreateTransactionDTO.Response> {
        let dueDate = new Date();
        
        if (req.frozen) {
            const globalFound = await this.globalRepo.getGlobal();
            if (globalFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
            }

            const global = globalFound.getValue()!;

            dueDate.setDate(dueDate.getDate() + global.balanceUnfreezeTerms);
        }
         
        const transaction = new TransactionModel({
            from: req.from,
            to: req.to,
            currency: req.currency,
            type: req.type,
            sum: req.sum,
            context: req.context,
            origin: req.origin,
            frozen: req.frozen,
            dueDate: dueDate
        });

        if (req.timestamp) {
            transaction.timestamp = req.timestamp;
        }

        if (req.coupon) {           
            const transactionCoupon = new CouponModel({
                ...req.coupon.toObject()
            });

            const refCreated = await this.createRefUseCase.execute({
                mode: transactionCoupon.ref.mode,
                ref: transactionCoupon.ref.ref.toString(),
                type: transactionCoupon.ref.type
            });

            if (refCreated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
            }

            const ref = refCreated.getValue()!;

            transactionCoupon.ref = ref;

            transaction.coupon = transactionCoupon;
        }

        if (req.subscription) {
            transaction.subscription = req.subscription;
        }

        if (req.organization) {
            const transactionOrganization = new OrganizationModel({
                ...req.organization.toObject()
            });

            const refCreated = await this.createRefUseCase.execute({
                mode: transactionOrganization.ref.mode,
                ref: transactionOrganization.ref.ref.toString(),
                type: transactionOrganization.ref.type
            });

            if (refCreated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
            }

            const ref = refCreated.getValue()!;

            transactionOrganization.ref = ref;

            transaction.organization = transactionOrganization;
        }

        if (req.purchase) {
            const transactionPurchase = new PurchaseModel({
                ...req.purchase.toObject()
            });

            const refCreated = await this.createRefUseCase.execute({
                mode: transactionPurchase.ref.mode,
                ref: transactionPurchase.ref.ref.toString(),
                type: transactionPurchase.ref.type
            });

            if (refCreated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
            }

            const ref = refCreated.getValue()!;

            transactionPurchase.ref = ref;

            transaction.purchase = transactionPurchase;
        }

        if (req.user) {
            const transactionUser = new UserModel({
                ...req.user.toObject()
            });

            const refCreated = await this.createRefUseCase.execute({
                mode: transactionUser.ref.mode,
                ref: transactionUser.ref.ref.toString(),
                type: transactionUser.ref.type
            });

            if (refCreated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
            }

            const ref = refCreated.getValue()!;

            transactionUser.ref = ref;

            transaction.user = transactionUser;
        }

        const transactionsFound = await this.transactionRepo.findByContexts([req.context!]);
        if (transactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const transactions = transactionsFound.getValue()!.filter(t => !t.disabled);

        const minute = 1*60*1000;
        const date = new Date();

        const createdTransaction = transactions.find(t => t.type == transaction.type);

        if (createdTransaction?.type == 'correct' && createdTransaction.sum == transaction.sum) {
            return Result.ok({transactionId: transaction._id});

        } else if (createdTransaction?.type == 'ref' && createdTransaction.sum == transaction.sum && createdTransaction.to == transaction.to) {
            return Result.ok({transactionId: transaction._id});

        } else if (createdTransaction && createdTransaction?.type == 'offer' && createdTransaction.timestamp.getTime() - date.getTime() > minute) {
            return Result.ok({transactionId: transaction._id})

        } else if (createdTransaction && createdTransaction?.type == 'purchase' && createdTransaction.timestamp.getTime() - date.getTime() > minute) {
            return Result.ok({transactionId: transaction._id})

        } else if (createdTransaction && createdTransaction?.type != 'offer' && createdTransaction?.type != 'purchase' && createdTransaction?.type != 'ref' && createdTransaction?.type != 'correct' && createdTransaction?.type != 'deposit' && createdTransaction?.type != 'depositBack' && createdTransaction?.type != 'packetRef' && createdTransaction?.type != 'packet') {
            return Result.ok({transactionId: transaction._id});
        
        }

        logger.infoWithMeta('Transaction created', {transaction: transaction.toObject()});

        const transactionSaved = await this.transactionRepo.save(transaction);
        if (transactionSaved.isFailure) {
            logger.error(transactionSaved.getError()!.stack!, transactionSaved.getError()!.message);

            const transactionSavedAttemt2 = await this.transactionRepo.save(transaction);
            if (transactionSavedAttemt2.isFailure) {
                logger.error(transactionSavedAttemt2.getError()!.stack!, transactionSavedAttemt2.getError()!.message);
                
                if (transaction.context) {
                    await this.disableTransactionsWithContext.execute({
                        context: transaction.context
                    });
                }

                return Result.fail(UseCaseError.create('a', 'Error upon creating transaction'));
            }
        }

        const walletsToBeRecalculated = [];

        if (req.from) {
            walletsToBeRecalculated.push(req.from);
        }

        if (req.to) {
            walletsToBeRecalculated.push(req.to);
        }

        if (walletsToBeRecalculated.length) {
            this.recalculateWalletBalanceUseCase.execute({
                walletIds: walletsToBeRecalculated,
                transaction: transaction
            });
        }

        return Result.ok({transactionId: transaction._id});
    }
}