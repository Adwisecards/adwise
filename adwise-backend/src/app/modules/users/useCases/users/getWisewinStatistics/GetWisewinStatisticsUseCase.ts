import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWisewinService } from "../../../../../services/wisewinService/IWisewinService";
import { TransactionRepo } from "../../../../finance/repo/transactions/implementation/TransactionRepo";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../models/User";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { GetUserFinancialStatisticsUseCase } from "../getUserFinancialStatistics/GetUserFinancialStatisticsUseCase";
import { GetWisewinStatisticsDTO } from "./GetWisewinStatisticsDTO";
import { getWisewinStatisticsErrors } from "./getWisewinStatisticsErrors";

export class GetWisewinStatisticsUseCase implements IUseCase<GetWisewinStatisticsDTO.Request, GetWisewinStatisticsDTO.Response> {
    private userRepo: IUserRepo;
    private walletRepo: IWalletRepo;
    private wisewinService: IWisewinService;
    private getUserFinancialStatisticsUseCase: GetUserFinancialStatisticsUseCase;
    private organizationRepo: IOrganizationRepo;
    private transactionRepo: ITransactionRepo;

    public errors = [
        ...getWisewinStatisticsErrors
    ];

    constructor(userRepo: IUserRepo, walletRepo: IWalletRepo, wisewinService: IWisewinService, getUserFinancialStatisticsUseCase: GetUserFinancialStatisticsUseCase, organizationRepo: IOrganizationRepo, transactionRepo: TransactionRepo) {
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.wisewinService = wisewinService;
        this.getUserFinancialStatisticsUseCase = getUserFinancialStatisticsUseCase;
        this.organizationRepo = organizationRepo;
        this.transactionRepo = transactionRepo;
    }

    public async execute(req: GetWisewinStatisticsDTO.Request): Promise<GetWisewinStatisticsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId) && !req.wisewinId) {
            return Result.fail(UseCaseError.create('c', 'userId or wisewinId not valid'));
        }

        let user: IUser;

        if (req.userId) {
            const userFound = await this.userRepo.findById(req.userId);
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
            }

            user = userFound.getValue()!;
        } else if (req.wisewinId) {
            const userFound = await this.userRepo.findByWinwiseId(req.wisewinId);
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
            }

            user = userFound.getValue()!;
        } else {
            return Result.fail(UseCaseError.create('c', 'Provided data is not valid'));
        }

        const managerOrganizationsFound = await this.organizationRepo.findByManager(user._id);
        if (managerOrganizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
        }

        const managerOrganizations = managerOrganizationsFound.getValue()!;

        const managerPercentTransactionsFound = await this.transactionRepo.findByTypeAndTo('managerPercent', user.wallet.toString());
        if (managerPercentTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding manager percent transactions'));
        }

        const managerPercentTransactions = managerPercentTransactionsFound.getValue()!.filter((t => !t.disabled));
        
        const managerPercentSum = managerPercentTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        const packetTransactionsFound = await this.transactionRepo.findByTypeAndTo('packet', user.wallet.toString());
        if (packetTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding packet transactions'));
        }

        const packetTransactions = packetTransactionsFound.getValue()!.filter((t => !t.disabled));

        const packetSum = packetTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        const packetRefTransactionsFound = await this.transactionRepo.findByTypeAndTo('packetRef', user.wallet.toString());
        if (packetRefTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding packet ref transactions'));
        }

        const packetRefTransactions = packetRefTransactionsFound.getValue()!.filter((t => !t.disabled));

        const packetRefSum = packetRefTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        const depositTransactionsFound = await this.transactionRepo.findByTypeAndFrom('withdrawal', user.wallet.toString());
        if (depositTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding deposit transactions'));
        }

        const depositTransactions = depositTransactionsFound.getValue()!.filter((t => !t.disabled));
        
        const depositSum = depositTransactions.reduce((sum, cur) => sum += cur.sum, 0);

        const wisewinManagerFound = await this.wisewinService.getUser(user.wisewinId);
        if (wisewinManagerFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding wisewin manager'));
        }

        const wisewinManager = wisewinManagerFound.getValue()!;

        const wisewinPacket = wisewinManager.tariffTitle;

        const remainingPackets = wisewinManager.packageRewardLimit - user.organizationPacketsSold;

        const remainingStartPackets = wisewinManager.startPackagesLeft - user.startPacketsSold;

        const walletFound = await this.walletRepo.findById(user.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding wallet'));
        }

        const wallet = walletFound.getValue()!;
        wallet.points += Math.round((wallet.bonusPoints + wallet.cashbackPoints) * 100) / 100;
        wallet.bonusPoints = 0;
        wallet.cashbackPoints = 0;

        return Result.ok({
            managerOrganizations: managerOrganizations.length,
            managerPercentSum: Math.round(managerPercentSum * 100) / 100,
            packetSum: Math.round(packetSum * 100) / 100,
            packetRefSum: Math.round(packetRefSum * 100) / 100,
            depositSum: Math.round(depositSum * 100) / 100,
            wisewinPacket: wisewinPacket,
            remainingPackets,
            remainingStartPackets,
            totalSoldPackets: user.organizationPacketsSold,
            totalSoldStartPackets: user.startPacketsSold
        });
    }
}