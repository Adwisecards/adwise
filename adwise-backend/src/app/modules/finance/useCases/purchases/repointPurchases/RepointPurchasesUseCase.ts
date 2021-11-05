import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { RepointPurchasesDTO } from "./RepointPurchasesDTO";
import { repointPurchasesErrors } from "./repointPurchasesErrors";

export class RepointPurchasesUseCase implements IUseCase<RepointPurchasesDTO.Request, RepointPurchasesDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private walletRepo: IWalletRepo;
    private transactionRepo: ITransactionRepo;
    private userRepo: IUserRepo;
    
    public errors = repointPurchasesErrors;

    constructor(purchaseRepo: IPurchaseRepo, walletRepo: IWalletRepo, transactionRepo: ITransactionRepo, userRepo: IUserRepo) {
        this.purchaseRepo = purchaseRepo;
        this.walletRepo = walletRepo;
        this.transactionRepo = transactionRepo;
        this.userRepo = userRepo;
    }

    public async execute(_: RepointPurchasesDTO.Request): Promise<RepointPurchasesDTO.Response> {
        const purchasesFound = await this.purchaseRepo.getAll();
        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchaes'));
        }

        const purchases = purchasesFound.getValue()!;

        const ids: string[] = [];
        for (const purchase of purchases) {
            if (!purchase.confirmed) continue;

            const transactionsFound = await this.transactionRepo.findByContexts([purchase._id.toString()]);
            if (transactionsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
            }

            const transactions = transactionsFound.getValue()!;

            const paymentTransaction = transactions.find(t => t.type == 'payment');
            if (!paymentTransaction) continue;

            const walletFound = await this.walletRepo.findById(paymentTransaction.from.toString());
            if (walletFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding wallet'));
            }

            const wallet = walletFound.getValue()!;

            const userFound = await this.userRepo.findById(wallet.user.toString());
            if (userFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
            }

            const user = userFound.getValue()!;

            if (purchase.user.toString() == wallet.user.toString()) {
                continue;
            }

            const purchaserUserFound = await this.userRepo.findById(purchase.user.toString());
            if (purchaserUserFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding purchaser user'));
            }

            const purchaserUser = purchaserUserFound.getValue()!;

            const purchaseIndex = purchaserUser.purchases.findIndex(p => p.toString() == purchase._id.toString());
            if (purchaseIndex != -1) {
                purchaserUser.purchases.splice(purchaseIndex, 1);
                
                const purchaserUserSaved = await this.userRepo.save(purchaserUser);
                if (purchaserUserSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving purchaser user'));
                }
            }

            purchase.user = user._id;
            purchase.purchaser = user.contacts[0];

            user.purchases.push(purchase._id);

            const purchaseSaved = await this.purchaseRepo.save(purchase);
            if (purchaseSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving purchase'));
            }

            const userSaved = await this.userRepo.save(user);
            if (userSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
            }

            ids.push(purchase._id.toString());
        }

        return Result.ok({ids});
    }
}