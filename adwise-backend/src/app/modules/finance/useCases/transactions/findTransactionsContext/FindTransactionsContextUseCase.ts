import { boolean, date } from "joi";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IPurchase } from "../../../models/Purchase";
import { ITransaction } from "../../../models/Transaction";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { FindTransactionsContextDTO } from "./FindTransactionsContextDTO";
import { findTransactionsContextErrors } from "./findTransactionsContextErrors";

export class FindTransactionsContextUseCase implements IUseCase<FindTransactionsContextDTO.Request, FindTransactionsContextDTO.Response> {
    private walletRepo: IWalletRepo;
    private purchaseRepo: IPurchaseRepo;
    private transactionRepo: ITransactionRepo;
    private organizationRepo: IOrganizationRepo;

    public errors = findTransactionsContextErrors;

    constructor(
        walletRepo: IWalletRepo,
        purchaseRepo: IPurchaseRepo,
        transactionRepo: ITransactionRepo,
        organizationRepo: IOrganizationRepo
    ) {
        this.walletRepo = walletRepo;
        this.purchaseRepo = purchaseRepo;
        this.transactionRepo = transactionRepo;
        this.organizationRepo = organizationRepo;
    }

    public async execute(_: FindTransactionsContextDTO.Request): Promise<FindTransactionsContextDTO.Response> {
        const transactionsFound = await this.transactionRepo.findManyWithoutContext();
        if (transactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const transactions = transactionsFound.getValue()!.filter(t => !t.disabled);

        const transactionsInContextList: ITransaction[][] = [];

        const transactionMap: {[key: string]: boolean} = {};

        for (const transaction of transactions) {
            if (transactionMap[transaction._id.toString()]) continue;

            const dateFrom = new Date(transaction.timestamp.getTime());
            const dateTo = new Date(transaction.timestamp.getTime());

            dateFrom.setSeconds(dateFrom.getSeconds() - 1);
            dateTo.setSeconds(dateTo.getSeconds() + 1);

            const transactionsInContext = transactions.filter(t => t.timestamp.getTime() >= dateFrom.getTime() && t.timestamp.getTime() <= dateTo.getTime());
            if (transactionsInContext.length < 4) {
                continue;
            }

            let skip = false;

            for (const transactionInContext of transactionsInContext) {
                if (transactionMap[transactionInContext._id.toString()]) {
                    skip = true;
                }
            }

            if (skip) {
                continue;
            }

            transactionsInContextList.push(transactionsInContext);

            transactionMap[transaction._id.toString()] = true;

            // console.log(
            //     transactionsInContext.map(t => {return {type: t.type, id: t._id, sum: t.sum.toFixed(2)}}),
            //     transactionsInContext.reduce((sum, cur) => sum += cur.sum, 0)
            // );
        }

        for (const transactionList of transactionsInContextList) {
            await this.main(transactionList);
        }

        return Result.ok({ids: []});
    }

    private async main(transactionsInContext: ITransaction[]): Promise<Result<string | null, UseCaseError | null>> {
        const purchaseTransaction = transactionsInContext.find(t => t.type == 'purchase');
        if (!purchaseTransaction) {
            return Result.fail(UseCaseError.create('a', 'Purchase transaction does not exist'));
        }
        
        const walletFound = await this.walletRepo.findById(purchaseTransaction.to.toString());
        if (walletFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding wallet'));
        }

        const wallet = walletFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(wallet.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization'));
        }

        const organization = organizationFound.getValue()!;

        const purchasesFound = await this.purchaseRepo.findByOrganization(
            organization._id,
            9999,
            1,
            true,
            undefined,
            purchaseTransaction.timestamp.toISOString()
        );

        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const transactionSum = Math.floor(transactionsInContext.reduce((sum, cur) => sum += cur.sum, 0));

        const purchases = purchasesFound.getValue()!
            .filter(p => !p.canceled)
            .filter(p => p.sumInPoints >= transactionSum - 1 && p.sumInPoints <= transactionSum);

        // console.log('purchases:', purchases.length);

        const purchaseIds: string[] = [];
        
        for (const purchase of purchases) {
            const transactionsFound = await this.transactionRepo.findByContexts([purchase._id.toString()]);
            if (transactionsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
            }

            const transactions = transactionsFound.getValue()!.filter(t => !t.disabled);

            if (transactions.length) {
                continue;
            }

            if (purchase._id.toString() == '5fc8d6b7db95460027014d41') {
                console.log(purchase._id, transactions.length);;
            }

            purchaseIds.push(purchase._id);
        }

        for (const purchaseId of purchaseIds) {
            await this.bindTransactions(purchaseId, transactionsInContext);
        }

        // console.log('without transactions:', purchaseIds.length);

        return Result.ok('');
    }

    private async bindTransactions(purchaseId: string, transactions: ITransaction[]): Promise<Result<true | null, UseCaseError | null>> {
        for (const transaction of transactions) {
            transaction.context = purchaseId;
        
            const transactionSaved = await this.transactionRepo.save(transaction);
            if (transactionSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving transaction'));
            }
        }

        return Result.ok(true);
    }
}