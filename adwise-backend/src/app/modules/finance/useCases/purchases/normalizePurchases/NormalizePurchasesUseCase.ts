import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchase } from "../../../models/Purchase";
import { ITransaction } from "../../../models/Transaction";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { DisableTransactionUseCase } from "../../transactions/disableTransaction/DisableTransactionUseCase";
import { SetPurchasePaidUseCase } from "../setPurchasePaid/SetPurchasePaidUseCase";
import { NormalizePurchasesDTO } from "./NormalizePurchasesDTO";
import { normalizePurchasesErrors } from "./normalizePurchasesErrors";

interface IPurchaseWithTransactions {
    purchase: IPurchase;
    transactions: ITransaction[];
};

interface IKeyObjects {
    purchases: IPurchaseWithTransactions[];
}

export class NormalizePurchasesUseCase implements IUseCase<NormalizePurchasesDTO.Request, NormalizePurchasesDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private transactionRepo: ITransactionRepo;
    private setPurchasePaidUseCase: SetPurchasePaidUseCase;
    private disableTransactionUseCase: DisableTransactionUseCase;

    public errors = normalizePurchasesErrors;

    constructor(
        purchaseRepo: IPurchaseRepo, 
        transactionRepo: ITransactionRepo, 
        setPurchasePaidUseCase: SetPurchasePaidUseCase,
        disableTransactionUseCase: DisableTransactionUseCase
    ) {
        this.purchaseRepo = purchaseRepo;
        this.transactionRepo = transactionRepo;
        this.setPurchasePaidUseCase = setPurchasePaidUseCase;
        this.disableTransactionUseCase = disableTransactionUseCase;
    }

    public async execute(_: NormalizePurchasesDTO.Request): Promise<NormalizePurchasesDTO.Response> {
        const keyObjectsGotten = await this.getKeyObjects();
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            purchases
        } = keyObjectsGotten.getValue()!;

        const excessiveTransactionsDisabled = await this.correctPurchaseTransactions(purchases);
        if (excessiveTransactionsDisabled.isFailure) {
            return Result.fail(excessiveTransactionsDisabled.getError());
        }

        const purchaseIds = excessiveTransactionsDisabled.getValue()!;

        return Result.ok({purchaseIds});
    }

    private async correctPurchaseTransactions(purchases: IPurchaseWithTransactions[]): Promise<Result<string[] | null, UseCaseError | null>> {
        const purchaseIds: string[] = [];
        
        for (const purchase of purchases) {
            const transactions = purchase.transactions;

            if (!transactions.length) {
                //incorrectPurchaseIds.push(purchase._id.toString());
                continue;
            }

            const paymentTransaction = transactions.find(t => t.type == 'payment');
            const usedPointsTransaction = transactions.find(t => t.type == 'usedPoints');
            const purchaseTransaction = transactions.find(t => t.type == 'purchase');
            const correctTransaction = transactions.find(t => t.type == 'correct');

            if (!paymentTransaction || !usedPointsTransaction || !purchaseTransaction) {
                continue;
            }

            const sum = paymentTransaction.sum + usedPointsTransaction.sum;

            const transactionSum = transactions.reduce((sum, cur) => {
                return sum += cur.type == 'payment' || cur.type == 'usedPoints' || cur.type == 'correct' ? 0 : cur.sum;
            }, 0);

            const difference = Math.floor(transactionSum) - Math.floor(sum);

            if (Math.abs(difference) > 2) {
                console.log(difference);
                if (difference > 0) {
                    purchaseTransaction.sum -= Math.abs(difference);
                    if (correctTransaction) {
                        correctTransaction.sum -= Math.abs(difference);
                    } 
                } else {
                    purchaseTransaction.sum += Math.abs(difference);
                    if (correctTransaction) {
                        correctTransaction.sum += Math.abs(difference);
                    } 
                }

                const purchaseTransactionSaved = await this.transactionRepo.save(purchaseTransaction);
                if (purchaseTransactionSaved.isFailure) {
                    continue;
                }

                if (correctTransaction) {
                    const correctTransactionSaved = await this.transactionRepo.save(correctTransaction);
                    if (correctTransactionSaved.isFailure) {
                        continue;
                    }
                }

                purchaseIds.push(purchase.purchase._id);
            }
        }

        return Result.ok(purchaseIds);
    }

    private async disableExcessiveTransactions(purchases: IPurchaseWithTransactions[]): Promise<Result<string[] | null, UseCaseError | null>> {
        const necessaryTransactions = ['usedPoints', 'payment', 'managerPercent', 'adwise', 'offer', 'purchase'];
        
        const purchaseIds: string[] = [];

        let isPurchaseWithExcessiveTransactions = false;
        
        for (let i in purchases) {
            const purchase = {...purchases[i]};

            purchases[i] = undefined as any;

            console.log('About to check', purchase.purchase._id);

            const paymentTransactions = purchase.transactions.filter(t => t.type == 'payment');
            if (paymentTransactions.length > 1) {
                isPurchaseWithExcessiveTransactions = true;
                const transactionsToDisable = paymentTransactions.slice(0, paymentTransactions.length-1);
                
                for (const transactionToDisable of transactionsToDisable) {
                    await this.disableTransactionUseCase.execute({
                        disabled: true,
                        transactionId: transactionToDisable._id.toString()
                    });
                    
                }
            }

            const usedPointsTransactions = purchase.transactions.filter(t => t.type == 'usedPoints');
            if (usedPointsTransactions.length > 1) {
                isPurchaseWithExcessiveTransactions = true;

                const transactionsToDisable = usedPointsTransactions.slice(0, usedPointsTransactions.length-1);

                for (const transactionToDisable of transactionsToDisable) {
                    const transactionDisabled = await this.disableTransactionUseCase.execute({
                        disabled: true,
                        transactionId: transactionToDisable._id.toString()
                    });

                    if (transactionDisabled.isFailure) {
                        return Result.fail(UseCaseError.create('a', 'Error upon disabling transaction'));
                    }
                }
            }

            const offerTransactions = purchase.transactions.filter(t => t.type == 'offer');
            if (offerTransactions.length > 1) {
                isPurchaseWithExcessiveTransactions = true;

                const transactionsToDisable = offerTransactions.slice(0, offerTransactions.length-1);

                for (const transactionToDisable of transactionsToDisable) {
                    await this.disableTransactionUseCase.execute({
                        disabled: true,
                        transactionId: transactionToDisable._id.toString()
                    });
                }
            }

            const adwiseTransactions = purchase.transactions.filter(t => t.type == 'adwise');
            if (adwiseTransactions.length > 1) {
                isPurchaseWithExcessiveTransactions = true;

                const transactionsToDisable = adwiseTransactions.slice(0, adwiseTransactions.length-1);

                for (const transactionToDisable of transactionsToDisable) {
                    await this.disableTransactionUseCase.execute({
                        disabled: true,
                        transactionId: transactionToDisable._id.toString()
                    });
                }
            }

            const managerPercentTransactions = purchase.transactions.filter(t => t.type == 'managerPercent');
            if (managerPercentTransactions.length > 1) {
                isPurchaseWithExcessiveTransactions = true;

                const transactionsToDisable = managerPercentTransactions.slice(0, managerPercentTransactions.length-1);

                for (const transactionToDisable of transactionsToDisable) {
                    await this.disableTransactionUseCase.execute({
                        disabled: true,
                        transactionId: transactionToDisable._id.toString()
                    });
                }
            }

            const purchaseTransactions = purchase.transactions.filter(t => t.type == 'purchase');
            if (purchaseTransactions.length > 1) {
                isPurchaseWithExcessiveTransactions = true;

                const transactionsToDisable = purchaseTransactions.slice(0, purchaseTransactions.length-1);

                for (const transactionToDisable of transactionsToDisable) {
                    await this.disableTransactionUseCase.execute({
                        disabled: true,
                        transactionId: transactionToDisable._id.toString()
                    });
                }
            }

            const refTransactions = purchase.transactions.filter(t => t.type == 'ref');

            const refTransactionMap: {
                [key: string]: ITransaction[];
            } = {};

            for (const refTransaction of refTransactions) {
                const refTransactionInMap = refTransactionMap[refTransaction.to.toString()];
                if (refTransactionInMap) {
                    refTransactionInMap.push(refTransaction);
                } else {
                    refTransactionMap[refTransaction.to.toString()] = [];
                }
            }
            
            const doubleRefTransactions: ITransaction[] = [];

            for (const doubleRefTransactionArray of Object.values(refTransactionMap)) {
                doubleRefTransactions.push(...doubleRefTransactionArray);
            }

            if (doubleRefTransactions.length) {
                isPurchaseWithExcessiveTransactions = true;
            }

            for (const transactionToDisable of doubleRefTransactions) {
                await this.disableTransactionUseCase.execute({
                    disabled: true,
                    transactionId: transactionToDisable._id.toString()
                });
            }

            let confirmPurchase = false;
            let atLeastOneTransaction = false;

            for (const necessaryTransaction of necessaryTransactions) {
                if (!purchase.transactions.find(t => t.type == necessaryTransaction)) {
                    confirmPurchase = true;
                } else {
                    atLeastOneTransaction = true;
                }
            }

            if (confirmPurchase && !purchase.purchase.confirmed) {
                isPurchaseWithExcessiveTransactions = true;

                purchase.purchase.confirmed = true;

                const purchaseSaved = await this.purchaseRepo.save(purchase.purchase);
                if (purchaseSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
                }
            }

            if (atLeastOneTransaction && !purchase.purchase.confirmed && !purchase.purchase.canceled) {
                isPurchaseWithExcessiveTransactions = true;

                const purchasePaid = await this.setPurchasePaidUseCase.execute({
                    purchaseId: purchase.purchase._id
                });
                
                if (purchasePaid.isFailure) {
                    console.log(purchasePaid.getError());
                    //return Result.fail(UseCaseError.create('a', 'Error upon setting purchase paid'));
                }
            }
            
            console.log('purchase', purchase.purchase._id, 'has been normalized');
            if (isPurchaseWithExcessiveTransactions) {
                purchaseIds.push(purchase.purchase._id.toString());
            }
        }

        return Result.ok(purchaseIds);
    }

    private async getKeyObjects(): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        //const purchasesFound = await this.purchaseRepo.getAll();
        const purchaseIds = [
            '60441c8fafa3da00129aef8f',
            '6044204cafa3da00129fb434',
            '6045f84b7f215400124c8016',
            '604617a71b054800133fc4ff',
            '6046185b1b054800133fc67a',
            '6049ec50c139c70012f4cf71',
            '6049ec52c139c70012f4cfe7',
            '604c72e33acf430012d43f4a',
            '604f01fd11ed0b002fe0fa16',
            '604f084e11ed0b002fe177e6',
            '604f089311ed0b002fe1dc45',
            '604f08d611ed0b002fe2409e',
            '604f090d11ed0b002fe2a61b',
            '604f093c11ed0b002fe30cc9',
            '604f097811ed0b002fe3738c',
            '604f278b11ed0b002fe57d6b',
            '604f2a0f11ed0b002fe5d717',
            '604faa4dac0f81001115fa16',
            '604faabaac0f81001116164a',
            '604fab1cac0f810011162cb2',
            '604fab41ac0f81001116406d',
            '604fae0aac0f8100111668a6',
            '604fb294ac0f8100111678bc',
            '6050c70a3f7c03001188ab53',
            '605101e5fa62200022da1899',
            '6051810e0536a4003005b9a1',
            '605183260536a40030060645',
            '6051866f0536a40030062e1a',
            '6051f4ed3d20c900129f4f95',
            '605200bc3d20c90012a08cdd',
            '605200e33d20c90012a08ed6',
            '605200fd3d20c90012a0900d',
            '605201193d20c90012a09222',
            '605201333d20c90012a09403'
        ];

        const purchasesFound = await this.purchaseRepo.findByIds(purchaseIds);
        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting purchases'));
        }

        const purchases = purchasesFound.getValue()!//!.slice(1000);

        // const purchaseFound = await this.purchaseRepo.findById('6046185b1b054800133fc67a');
        // if (purchaseFound.isFailure) {
        //     return Result.fail(UseCaseError.create('a', 'Error upon finding purchase'));
        // }

        // const purchases = [purchaseFound.getValue()!];

        const purchasesWithTransactions: IPurchaseWithTransactions[] = [];

        for (const purchase of purchases) {
            const transactionsFound = await this.transactionRepo.findByContexts([purchase._id.toString()]);
            if (transactionsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
            }

            const transactions = transactionsFound.getValue()!.filter(t => !t.disabled);

            if (!transactions.length) continue;

            purchasesWithTransactions.push({
                purchase: purchase,
                transactions: transactions
            });
        }

        return Result.ok({
            purchases: purchasesWithTransactions
        });
    }
}