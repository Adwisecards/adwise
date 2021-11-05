import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { logger } from "../../../../../services/logger";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IWallet } from "../../../models/Wallet";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { GetAllWalletTransactionsSumUseCase } from "../../transactions/getAllWalletTransactionsSum/GetAllWalletTransactionsSumUseCase";
import { RecalculateWalletBalanceDTO } from "./RecalculateWalletBalanceDTO";
import { recalculeWalletBalanceErrors } from "./recalculateWalletBalanceErrors";

export class RecalculateWalletBalanceUseCase implements IUseCase<RecalculateWalletBalanceDTO.Request, RecalculateWalletBalanceDTO.Response> {
    private walletRepo: IWalletRepo;
    private getAllWalletTransactionsSumUseCase: GetAllWalletTransactionsSumUseCase;
    private organizationRepo: IOrganizationRepo;

    public errors = [
        ...recalculeWalletBalanceErrors
    ];

    constructor(walletRepo: IWalletRepo, getAllWalletTransactionsSumUseCase: GetAllWalletTransactionsSumUseCase, organizationRepo: IOrganizationRepo) {
        this.walletRepo = walletRepo;
        this.getAllWalletTransactionsSumUseCase = getAllWalletTransactionsSumUseCase;
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: RecalculateWalletBalanceDTO.Request): Promise<RecalculateWalletBalanceDTO.Response> {
        const walletsGotten = await this.getWallets(req.walletIds);//(req.walletIds);
        if (walletsGotten.isFailure) {
            return Result.fail(walletsGotten.getError());
        } 

        const wallets = walletsGotten.getValue()!;

        logger.info('SYSTEM: About to recalculate wallet balances', wallets.length > 3 ? 'of ' + wallets.length + ' wallets' : wallets.map(w => w._id).join(' '));

        const recalculatedWallets = [];

        for (const wallet of wallets) {
            const transactionSumFound = await this.getAllWalletTransactionsSumUseCase.execute({
                walletId: wallet._id,
                transaction: req.transaction
            });
            if (transactionSumFound.isFailure) {
                continue;
            }

            const {
                bonusPoints,
                cashbackPoints,
                frozenPoints,
                points,
                deposit,
                frozenPointsSum
            } = transactionSumFound.getValue()!;

            wallet.points = points;
            wallet.bonusPoints = bonusPoints;
            wallet.cashbackPoints = cashbackPoints;
            wallet.deposit = deposit;
            wallet.frozenPointsSum = frozenPointsSum;

            console.log('points', points);
            console.log('bonusPoints', bonusPoints);
            console.log('cashbackPoints', cashbackPoints);
            console.log('deposit', deposit);
            console.log('frozenPointsSum', frozenPointsSum);

            wallet.frozenPoints = frozenPoints;
            wallet.updatedAt = new Date();

            const walletSaved = await this.walletRepo.save(wallet);

            if (walletSaved.isSuccess) {
                recalculatedWallets.push(wallet._id.toString());
            } else {
                const error = walletSaved.getError()!;
                logger.error(error.stack!, error.message);
            }
        }

        return Result.ok({walletIds: recalculatedWallets});
    }

    private async getWallets(walletIds?: string[]): Promise<Result<IWallet[] | null, UseCaseError | null>> {
        let wallets: IWallet[] = [];

        // walletIds = ['60364b8e3a64a10012ae92b9'];
        
        if (walletIds && walletIds.length) {
            const walletsFound = await this.walletRepo.findByIds(walletIds);
            if (walletsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding wallets'));
            }

            wallets = walletsFound.getValue()!;

        } else {
            const walletsFound = await this.walletRepo.getAll();
            if (walletsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding wallets'));
            }

            wallets = walletsFound.getValue()!;
        }

        return Result.ok(wallets);
    }
}