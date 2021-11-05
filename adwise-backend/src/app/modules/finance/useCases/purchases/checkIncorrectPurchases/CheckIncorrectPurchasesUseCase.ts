import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { CheckIncorrectPurchasesDTO } from "./CheckIncorrectPurchasesDTO";
import { checkIncorrectPurchasesErrors } from "./checkIncorrectPurchasesErrors";

export class CheckIncorrectPurchasesUseCase implements IUseCase<CheckIncorrectPurchasesDTO.Request, CheckIncorrectPurchasesDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private transactionRepo: ITransactionRepo;

    public errors = checkIncorrectPurchasesErrors;

    constructor(purchaseRepo: IPurchaseRepo, transactionRepo: ITransactionRepo) {
        this.purchaseRepo = purchaseRepo;
        this.transactionRepo = transactionRepo;
    }

    public async execute(_: CheckIncorrectPurchasesDTO.Request): Promise<CheckIncorrectPurchasesDTO.Response> {
        const purchasesGotten = await this.purchaseRepo.getAll();
        if (purchasesGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting purchaes'));
        }

        const purchases = purchasesGotten.getValue()!.filter(p => p.confirmed && !p.canceled);

        const incorrectPurchaseIds: string[] = [];

        for (const purchase of purchases) {
            const transactionsFound = await this.transactionRepo.findByContexts([purchase._id.toString()]);
            if (transactionsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
            }

            const transactions = transactionsFound.getValue()!.filter(t => !t.disabled);

            if (!transactions.length) {
                //incorrectPurchaseIds.push(purchase._id.toString());
                continue;
            }

            const paymentTransaction = transactions.find(t => t.type == 'payment');
            const usedPointsTransaction = transactions.find(t => t.type == 'usedPoints');

            if (!paymentTransaction || !usedPointsTransaction) {
                incorrectPurchaseIds.push(purchase._id.toString());
                continue;
            }

            const sum = paymentTransaction.sum + usedPointsTransaction.sum;

            const transactionSum = transactions.reduce((sum, cur) => {
                return sum += cur.type == 'payment' || cur.type == 'usedPoints' || cur.type == 'correct' ? 0 : cur.sum;
            }, 0);

            if (Math.abs(Math.floor(transactionSum) - Math.floor(sum)) > 2) {
                console.log(Math.floor(transactionSum), Math.floor(sum));
                incorrectPurchaseIds.push(purchase._id.toString());
                continue;
            }
        }

        return Result.ok({incorrectPurchaseIds});
    }
}