import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ITransaction } from "../../../models/Transaction";
import { IWallet } from "../../../models/Wallet";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { GetAllWalletTransactionsSumDTO } from "./GetAllWalletTransactionsSumDTO";
import { getAllWalletTransactionsSumErrors } from './getAllWalletTransactionsSumErrors';

interface IKeyObjects {
    toTransactions: ITransaction[];
    disabledToTransactions: ITransaction[];
    fromTransactions: ITransaction[];
    disabledFromTransactions: ITransaction[];
    wallet: IWallet;
}

export class GetAllWalletTransactionsSumUseCase implements IUseCase<GetAllWalletTransactionsSumDTO.Request, GetAllWalletTransactionsSumDTO.Response> {
    private transactionRepo: ITransactionRepo;
    private organizationRepo: IOrganizationRepo;
    private userRepo: IUserRepo;
    private walletRepo: IWalletRepo;

    public errors = [
        ...getAllWalletTransactionsSumErrors
    ];

    constructor(
        transactionRepo: ITransactionRepo, 
        organizationRepo: IOrganizationRepo, 
        userRepo: IUserRepo, 
        walletRepo: IWalletRepo
    ) {
        this.transactionRepo = transactionRepo;
        this.organizationRepo = organizationRepo;
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
    }

    public async execute(req: GetAllWalletTransactionsSumDTO.Request): Promise<GetAllWalletTransactionsSumDTO.Response> {
        if (!Types.ObjectId.isValid(req.walletId)) {
            return Result.fail(UseCaseError.create('c', 'walletId is not valid'));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.walletId, req.transaction);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            disabledToTransactions,
            fromTransactions,
            toTransactions,
            disabledFromTransactions,
            wallet
        } = keyObjectsGotten.getValue()!;

        let walletType = '';

        const userFound = await this.userRepo.findByWallet(req.walletId);
        if (userFound.isSuccess) walletType = 'user';
        else {
            const organizationFound = await this.organizationRepo.findByWallet(req.walletId);
            if (organizationFound.isSuccess) walletType = 'organization';
        }

        if (walletType == 'organization') {
            return this.getOrganizationTransactionSum(!!req.transaction, wallet, disabledToTransactions, fromTransactions, toTransactions, disabledFromTransactions);
        } else {
            return this.getUserTransactionSum(!!req.transaction, wallet, disabledToTransactions, fromTransactions, toTransactions, disabledFromTransactions);
        }
    }

    private getUserTransactionSum(transaction: boolean, wallet: IWallet, disabledToTransactions: ITransaction[], fromTransactions: ITransaction[], toTransactions: ITransaction[], disabledFromTransactions: ITransaction[]): GetAllWalletTransactionsSumDTO.Response {
        let toBonusPointsTransactions = toTransactions.filter(t => (
            t.type == 'packet' ||
            t.type == 'deposit' ||
            t.type == 'managerPercent' ||
            t.type == 'ref' ||
            t.type == 'packetRef' ||
            t.type == 'correct' ||
            t.type == 'correctBonus'
        )); // []

        let disabledToBonusPointsTransactions = disabledToTransactions.filter(t => (
            t.type == 'packet' || 
            t.type == 'deposit' || 
            t.type == 'managerPercent' || 
            t.type == 'ref' || 
            t.type == 'packetRef' || 
            t.type == 'correct' || 
            t.type == 'correctBonus'
        )); // []

        let toCashbackPointsTransactions = toTransactions.filter(t => t.type == 'offer' || t.type == 'correctCashback'); // []

        let disabledToCashbackPointsTransactions = disabledToTransactions.filter(t => t.type == 'offer' || t.type == 'correctCashback'); // [125]

        const fromPointsTransactions = fromTransactions.filter(t => t.type != 'payment' && t.type != 'purchase' && t.type != 'cashPurchase' && t.type != 'tips') // && t.type != 'usedPoints'); // []
        const disabledFromPointsTransactions = disabledFromTransactions.filter(t => t.type != 'payment' && t.type != 'purchase' && t.type != 'cashPurchase' && t.type != 'tips') // && t.type != 'usedPoints'); // []

        let frozenToBonusTransactions = toBonusPointsTransactions.filter(t => t.frozen);
        let frozenDisabledToBonusTransactions = disabledToBonusPointsTransactions.filter(t => t.frozen);
        let frozenToCashbackTransactions = toCashbackPointsTransactions.filter(t => t.frozen);
        let frozenDisabledToCashbackTransactions = disabledToCashbackPointsTransactions.filter(t => t.frozen);

        toBonusPointsTransactions = toBonusPointsTransactions.filter(t => !t.frozen);
        disabledToBonusPointsTransactions = disabledToBonusPointsTransactions.filter(t => !t.frozen);

        toCashbackPointsTransactions = toCashbackPointsTransactions.filter(t => !t.frozen);
        disabledToCashbackPointsTransactions = disabledToCashbackPointsTransactions.filter(t => !t.frozen);

        let frozenBonusPoints = frozenToBonusTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        let frozenDisabledBonusPoints = frozenDisabledToBonusTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        let frozenCashbackPoints = frozenToCashbackTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        let frozenDisabledCashbackPoints = frozenDisabledToCashbackTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        let frozenPoints = frozenBonusPoints + frozenCashbackPoints;
        let disabledFrozenPoints = frozenDisabledBonusPoints + frozenDisabledCashbackPoints;

        let bonusPoints = toBonusPointsTransactions.reduce((sum, cur) => sum += cur.sum, 0); // 0
        let cashbackPoints = toCashbackPointsTransactions.reduce((sum, cur) => sum += cur.sum, 0); // 0

        let disabledBonusPoints = disabledToBonusPointsTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        let disabledCashbackPoints = disabledToCashbackPointsTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        
        let fromPoints = fromPointsTransactions.reduce((sum, cur) => sum += cur.sum, 0); // 0

        let disabledFromPoints = disabledFromPointsTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        
        // ???
        if (transaction) {
            bonusPoints += wallet.bonusPoints;
            cashbackPoints += wallet.cashbackPoints;

            bonusPoints -= disabledBonusPoints;
            cashbackPoints -= disabledCashbackPoints;
            
            fromPoints -= disabledFromPoints;

            frozenPoints += wallet.frozenPointsSum;
            frozenPoints -= disabledFrozenPoints;
        }
        // ???

        // console.log(toTransactions);

        console.log('cashbackPoints', cashbackPoints);
        console.log('bonusPoints', bonusPoints);
        console.log('fromPoints', fromPoints);

        bonusPoints -= fromPoints;
        let remainingPoints = 0;
        if (bonusPoints < 0) {
            remainingPoints = Math.abs(bonusPoints);
            bonusPoints = 0;
        }

        if (remainingPoints) {
            cashbackPoints -= remainingPoints;
        }

        return Result.ok({
            bonusPoints: bonusPoints,
            cashbackPoints: cashbackPoints,
            points: 0,
            deposit: 0,
            frozenPoints: wallet.frozenPoints,
            frozenPointsSum: frozenPoints
        });
    }


    private getOrganizationTransactionSum(transaction: boolean, wallet: IWallet, disabledToTransactions: ITransaction[], fromTransactions: ITransaction[], toTransactions: ITransaction[], disabledFromTransactions: ITransaction[]): GetAllWalletTransactionsSumDTO.Response {        
        fromTransactions = fromTransactions.filter(t => !disabledFromTransactions.find(dt => t._id.toString() == dt._id.toString()));
        toTransactions = toTransactions.filter(t => (t.origin != 'cash'));
        disabledToTransactions = disabledToTransactions.filter(t => (t.origin != 'cash'));
        
        let toDepositTransactions = toTransactions.filter(t => t.type == 'deposit');
        let disabledToDepositTransactions = disabledToTransactions.filter(t => t.type == 'deposit');
        let fromDepositTransactions = fromTransactions.filter(t => t.origin == 'cash' || t.type == 'depositBack');
        let disabledFromDepositTransactions = disabledFromTransactions.filter(t => t.origin == 'cash' || t.type == 'depositBack');

        let toBalanceTransactions = toTransactions.filter(t => t.type != 'deposit');
        let disabledToBalanceTransactions = disabledToTransactions.filter(t => t.type != 'deposit');
        let fromBalanceTransactions = fromTransactions.filter(t => t.origin != 'cash' && t.type != 'depositBack');
        let disabledFromBalanceTransactions = disabledFromTransactions.filter(t => t.origin != 'cash' && t.type != 'depositBack');

        let frozenToBalanceTransactions = toBalanceTransactions.filter(t => t.frozen);
        let frozenDisabledToBalanceTransactions = disabledToBalanceTransactions.filter(t => t.frozen);

        toBalanceTransactions = toBalanceTransactions.filter(t => !t.frozen);
        disabledToBalanceTransactions = disabledToBalanceTransactions.filter(t => !t.frozen);
    
        let toDepositSum = toDepositTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        let fromDepositSum = fromDepositTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        let disabledToDepositSum = disabledToDepositTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        let disabledFromDepositSum = disabledFromDepositTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        let toBalanceSum = toBalanceTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        let fromBalanceSum = fromBalanceTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        let disabledToBalanceSum = disabledToBalanceTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        let disabledFromBalanceSum = disabledFromBalanceTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        let frozenToBalanceSum = frozenToBalanceTransactions.reduce((sum, cur) => sum += cur.sum, 0);
        let frozenDisabledToBalanceSum = frozenDisabledToBalanceTransactions.reduce((sum, cur) => sum += cur.sum, 0);


        if (transaction) {
            toDepositSum += wallet.deposit || 0;
            toDepositSum -= disabledToDepositSum;
            fromDepositSum -= disabledFromDepositSum; 

            toBalanceSum += wallet.points;
            toBalanceSum -= disabledToBalanceSum;
            fromBalanceSum -= disabledFromBalanceSum;

            frozenToBalanceSum += wallet.frozenPointsSum || 0;
            frozenToBalanceSum -= frozenDisabledToBalanceSum;
        }

        const balancePoints = toBalanceSum - fromBalanceSum;
        const depositPoints = toDepositSum - fromDepositSum;
        const frozenPointsSum = frozenToBalanceSum;

        console.log(balancePoints, depositPoints, frozenPointsSum);

        return Result.ok({
            points: balancePoints,
            deposit: depositPoints,
            bonusPoints: 0, 
            cashbackPoints: 0, 
            frozenPoints: wallet.frozenPoints,
            frozenPointsSum: frozenPointsSum
        });
    }

    private async getKeyObjects(walletId: string, transaction?: ITransaction): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const walletFound = await this.walletRepo.findById(walletId);
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        let toTransactions: ITransaction[] = [];
        let fromTransactions: ITransaction[] = [];
        let disabledToTransactions: ITransaction[] = [];
        let disabledFromTransactions: ITransaction[] = [];

        if (!transaction) {
            const toTransactionsFound = await this.transactionRepo.findByTo(walletId);
            if (toTransactionsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
            }

            disabledToTransactions = toTransactionsFound.getValue()!;

            toTransactions = toTransactionsFound.getValue()!;

            const fromTransactionsFound = await this.transactionRepo.findByFrom(walletId);
            if (fromTransactionsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
            }

            disabledFromTransactions = fromTransactionsFound.getValue()!;

            fromTransactions = fromTransactionsFound.getValue()!;
        } else {
            if (transaction.to && transaction.to.toString() == wallet._id.toString()) {
                if (transaction.disabled) {
                    disabledToTransactions.push(transaction);
                } else {
                    toTransactions.push(transaction);
                }
            } else {
                if (transaction.disabled) {
                    disabledFromTransactions.push(transaction);
                } else {
                    fromTransactions.push(transaction);
                }
            }
        }

        return Result.ok({
            disabledToTransactions: disabledToTransactions.filter(t => t.disabled),
            fromTransactions: fromTransactions.filter(t => !t.disabled),
            toTransactions: toTransactions.filter(t => !t.disabled),
            disabledFromTransactions: disabledFromTransactions.filter(t => t.disabled),
            wallet
        });
    }
}