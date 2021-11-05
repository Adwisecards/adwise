import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { CreateTransactionUseCase } from "../../transactions/createTransaction/CreateTransactionUseCase";
import { FixMissingTransactionsDTO } from "./FixMissingTransactionsDTO";
import { fixMissingTransactionsErrors } from "./fixMissingTransactionsErrors";

export class FixMissingTransactionsUseCase implements IUseCase<FixMissingTransactionsDTO.Request, FixMissingTransactionsDTO.Response> {
    private createTransactionUseCase: CreateTransactionUseCase;
    private purchaseRepo: IPurchaseRepo;
    private transactionRepo: ITransactionRepo;
    private globalRepo: IGlobalRepo;
    private organizationRepo: IOrganizationRepo;
    private userRepo: IUserRepo;

    public errors = fixMissingTransactionsErrors;

    constructor(createTransactionUseCase: CreateTransactionUseCase, purchaseRepo: IPurchaseRepo, transactionRepo: ITransactionRepo, globalRepo: IGlobalRepo, organizationRepo: IOrganizationRepo, userRepo: IUserRepo) {
        this.createTransactionUseCase = createTransactionUseCase;
        this.purchaseRepo = purchaseRepo;
        this.transactionRepo = transactionRepo;
        this.globalRepo = globalRepo;
        this.organizationRepo = organizationRepo;
        this.userRepo = userRepo;
    }

    public async execute(_: FixMissingTransactionsDTO.Request): Promise<FixMissingTransactionsDTO.Response> {
        const purchasesFound = await this.purchaseRepo.getAll();
        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const purchases = purchasesFound.getValue()!;

        const globalGotten = await this.globalRepo.getGlobal()!;
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding global'));
        }

        const global = globalGotten.getValue()!;

        const ids: string[] = [];

        for (const purchase of purchases) {
            const transactionsFound = await this.transactionRepo.findByContexts([purchase._id.toString()]);
            if (transactionsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
            }

            const transactions = transactionsFound.getValue()!;
            if (!transactions.length) {
                continue;
            }

            const organizationFound = await this.organizationRepo.findById(purchase.organization.toString());
            if (organizationFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding organization'));
            }

            const organization = organizationFound.getValue()!;

            let manager: IUser | undefined;

            const managerFound = await this.userRepo.findById(organization.manager.toString());
            if (managerFound.isSuccess) {
                manager = managerFound.getValue()!;
            }

            const purchaserFound = await this.userRepo.findById(purchase.user.toString());
            if (purchasesFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding purchaser'));
            }

            const purchaser = purchaserFound.getValue()!;
            
            const adwiseTransaction = transactions.find(t => t.type == 'adwise');
            const managerPercentTransaction = transactions.find(t => t.type == 'managerPercent');
            const paymentTransaction = transactions.find(t => t.type == 'payment');
            const usedPointsTransaction = transactions.find(t => t.type == 'usedPoints');
            const offerTransaction = transactions.find(t => t.type == 'offer');
            const refBackToOrganizationTransaction = transactions.find(t => t.type == 'refBackToOrganization');
            const purchaseTransaction = transactions.find(t => t.type == 'purchase');

            const managerPoints = managerPercentTransaction ? managerPercentTransaction.sum : (manager ? purchase.sumInPoints * (global.managerPercent / 100) : 0);
            const adwisePoints = adwiseTransaction ? adwiseTransaction.sum : (purchase.sumInPoints * (global.purchasePercent / 100)) - managerPoints;

            if (!adwiseTransaction) {
                const transactionCreated = await this.createTransactionUseCase.execute({
                    type: 'adwise',
                    currency: 'rub',
                    from: undefined as any,
                    to: undefined as any,
                    sum: adwisePoints,
                    timestamp: transactions[0].timestamp,
                    context: purchase._id.toString(),
                    frozen: false
                });
                if (transactionCreated.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon creating transaction'));
                }
            } else if (adwiseTransaction && adwiseTransaction.to) {
                adwiseTransaction.to = undefined as any;
                
                const transactionSaved = await this.transactionRepo.save(adwiseTransaction);
                if (transactionSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving transaction'));
                }
            }

            if (!managerPercentTransaction) {
                const transactionCreated = await this.createTransactionUseCase.execute({
                    type: 'managerPercent',
                    currency: 'rub',
                    from: undefined as any,
                    to: manager?.wallet.toString() as any,
                    sum: managerPoints,
                    timestamp: transactions[0].timestamp,
                    context: purchase._id.toString(),
                    frozen: false
                });
                if (transactionCreated.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon creating transaction'));
                }
            }

            if (!paymentTransaction) {
                const transactionCreated = await this.createTransactionUseCase.execute({
                    type: 'payment',
                    currency: 'rub',
                    from: purchaser.wallet.toString(),
                    to: undefined as any,
                    sum: purchase.sumInPoints - (usedPointsTransaction! ? usedPointsTransaction!.sum : 0),
                    timestamp: transactions[0].timestamp,
                    context: purchase._id.toString(),
                    frozen: false
                });
                if (transactionCreated.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon creating transaction'));
                }
            }

            if (!paymentTransaction || !adwiseTransaction || !managerPercentTransaction || !refBackToOrganizationTransaction) {
                ids.push(purchase._id);
            }

            if (!refBackToOrganizationTransaction) {
                const paymentSum = paymentTransaction!.sum + usedPointsTransaction!.sum;
                const realisedSum = offerTransaction!.sum + adwisePoints + managerPoints + purchaseTransaction!.sum;

                const transactionCreated = await this.createTransactionUseCase.execute({
                    type: 'refBackToOrganization',
                    currency: 'rub',
                    from: undefined as any,
                    to: organization.wallet.toString(),
                    sum: paymentSum - realisedSum,
                    timestamp: transactions[0].timestamp,
                    context: purchase._id.toString(),
                    frozen: false
                });
                if (transactionCreated.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon creating transacion'));
                }
            }
        }

        return Result.ok({ids});
    }
}