// import { Result } from "../../../../../../core/models/Result";
// import { ITransaction } from "../../../../models/Transaction";
// import { RecalculateWalletBalanceUseCase } from "../../../../useCases/wallets/recalculateWalletBalance/RecalculateWalletBalanceUseCase";
// import { ITransactionAccumulationService } from "../ITransactionAccumulationService";

// export type AccumulatedTransactions = {
//     transactions: ITransaction[];
//     timestamp: Date;
// };

// export class TransactionAccumulationService implements ITransactionAccumulationService {
//     private accumulatedTransactions = new Map<string, AccumulatedTransactions>();
//     private recalculateWalletBalancesUseCase: RecalculateWalletBalanceUseCase;

//     constructor(recalculateWalletBalancesUseCase: RecalculateWalletBalanceUseCase) {
//         this.recalculateWalletBalancesUseCase = recalculateWalletBalancesUseCase;
//     }

//     public accumulate(transaction: ITransaction): Result<boolean | null, Error | null> {
//         try {
//             const context = transaction.context || '';
            
//             const accumulatedTransactions = this.accumulatedTransactions.get(context);

//             if (!accumulatedTransactions) {
//                 this.accumulatedTransactions.set(context, {
//                     timestamp: new Date(),
//                     transactions: [transaction]
//                 });
//             } else {
//                 const transactionExists = !!accumulatedTransactions.transactions.find(t => t._id.toString() == transaction._id.toString());
//                 if (transactionExists) {
//                     throw new Error('Transaction is already accumulated');
//                 }

//                 accumulatedTransactions.transactions.push(transaction);
//             }            
//         } catch (ex) {
//             return Result.fail(ex);
//         }
//     }

//     public async recalculate(context: string): Promise<Result<string[] | null, Error | null>> {
//         try {
//             const accumulatedTransactions = this.accumulatedTransactions.get(context);
//             if (!accumulatedTransactions) {
//                 throw new Error('No accumulated transactions in the context');
//             }

//             const { transactions } = accumulatedTransactions;

//             const walletIds: string[] = [];

//             for (const transaction of transactions) {
//                 if (transaction.to) {
//                     wallets.push(transaction._id.toString());
//                 }

//                 if (transaction.from) {
//                     wallets.push(transaction._id.toString());
//                 }
//             }

//             const walletBalancesRecalculated = await this.recalculateWalletBalancesUseCase.execute({
//                 walletIds: walletIds,
//                 transaction: 
//             });
//         } catch (ex) {
//             return Result.fail(ex);
//         }
//     }
// }