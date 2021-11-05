import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { FindAllPurchasesDTO } from "../../../../administration/useCases/globals/findAllPurchases/FindAllPurchasesDTO";
import { ITransaction } from "../../../../finance/models/Transaction";
import { IWallet } from "../../../../finance/models/Wallet";
import { IWithdrawalRequest } from "../../../../finance/models/WithdrawalRequest";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { IWithdrawalRequestRepo } from "../../../../finance/repo/withdrawalRequests/IWithdrawalRequestRepo";
import { IOrganization } from "../../../models/Organization";
import { IOrganizationStatistics, IOrganizationStatisticsOperation, OrganizationStatisticsModel } from "../../../models/OrganizationStatistics";
import { IClientRepo } from "../../../repo/clients/IClientRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationStatisticsRepo } from "../../../repo/organizationStatistics/IOrganizationStatisticsRepo";
import { IOrganizationStatisticsService, IPurchaseWithStats } from "../../../services/organizations/organizationStatisticsService/IOrganizationStatisticsService";
import { GetOrganizationPurchasesUseCase } from "../../organizations/getOrganizationPurchases/GetOrganizationPurchasesUseCase";
import { UpdateOrganizationStatisticsDTO } from "./UpdateOrganizationStatisticsDTO";
import { updateOrganizationStatisticsErrors } from "./updateOrganizationStatisticsErrors";

export class UpdateOrganizationStatisticsUseCase implements IUseCase<UpdateOrganizationStatisticsDTO.Request, UpdateOrganizationStatisticsDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private withdrawalRequestRepo: IWithdrawalRequestRepo;
    private organizationStatisticsRepo: IOrganizationStatisticsRepo;
    private transactionRepo: ITransactionRepo;
    private organizationStatisticsService: IOrganizationStatisticsService;
    private clientRepo: IClientRepo;
    
    public errors = [
        ...updateOrganizationStatisticsErrors
    ];

    constructor(
        organizationRepo: IOrganizationRepo, 
        withdrawalRequestRepo: IWithdrawalRequestRepo,
        organizationStatisticsRepo: IOrganizationStatisticsRepo,
        transactionRepo: ITransactionRepo,
        organizationStatisticsService: IOrganizationStatisticsService,
        clientRepo: IClientRepo
    ) {
        this.organizationRepo = organizationRepo;
        this.withdrawalRequestRepo = withdrawalRequestRepo;
        this.organizationStatisticsRepo = organizationStatisticsRepo;
        this.transactionRepo = transactionRepo;
        this.organizationStatisticsService = organizationStatisticsService;
        this.clientRepo = clientRepo;
    }

    public async execute(req: UpdateOrganizationStatisticsDTO.Request): Promise<UpdateOrganizationStatisticsDTO.Response> {
        if (req.organizationId && !Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId is not valid'));
        }
        
        let organizations: IOrganization[] = [];
        
        if (req.organizationId) {
            const organizationFound = await this.organizationRepo.findById(req.organizationId);
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }

            organizations = [organizationFound.getValue()!];
        } else {
            const organizationsFound = await this.organizationRepo.getAll();
            if (organizationsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
            }

            organizations = organizationsFound.getValue()!;
        }

        for (const organization of organizations) {
            await this.main(organization._id.toString(), !req.organizationId);
        }

        return Result.ok({});
    }

    public async main(organizationId: string, scheduled: boolean): Promise<Result<true | null, UseCaseError | null>> {
        if (!Types.ObjectId.isValid(organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId is not valid'));
        }

        const organizationStatisticsGotten = await this.getOrganizationStatistics(organizationId);
        if (organizationStatisticsGotten.isFailure) {
            return Result.fail(organizationStatisticsGotten.getError());
        }

        const organizationStatistics = organizationStatisticsGotten.getValue()!;

        const date = new Date();
        date.setHours(date.getHours()-1); // last day

        if (scheduled && organizationStatistics.updatedAt.getTime() > date.getTime()) {
            return Result.ok(true);
        }

        const financialStatisticsCalculated = await this.organizationStatisticsService.collectFinancialStatistics(
            organizationId
        );

        if (financialStatisticsCalculated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon calculting financial statistcs'));
        }

        const {
            cashAdwiseSum,
            cashCashbackSum,
            cashManagerSum,
            cashMarketingSum,
            cashPaymentGatewaySum,
            cashProfitSum,
            cashPurchaseCount,
            cashPurchaseSum,
            cashRefFirstLevelSum,
            cashRefOtherLevelSum,
            depositPayoutSum,
            onlineAdwiseSum,
            onlineCashbackSum,
            onlineManagerSum,
            onlineMarketingSum,
            onlinePaymentGatewaySum,
            onlineProfitSum,
            onlinePurchaseCount,
            onlinePurchaseSum,
            onlineRefFirstLevelSum,
            onlineRefOtherLevelSum,
            paidToBankAccountSum,
            purchases,
            wallet,
            withdrawnSum
        } = financialStatisticsCalculated.getValue()!;

        const operationsGotten = await this.getOperations(purchases, wallet);
        if (operationsGotten.isFailure) {
            return Result.fail(operationsGotten.getError());
        }

        const operations = operationsGotten.getValue()!;

        organizationStatistics.updatedAt = new Date();
        organizationStatistics.onlineCashbackSum = onlineCashbackSum;
        organizationStatistics.cashCashbackSum = cashCashbackSum;
        organizationStatistics.onlineMarketingSum = onlineMarketingSum;
        organizationStatistics.cashMarketingSum = cashMarketingSum;
        organizationStatistics.onlineProfitSum = onlineProfitSum;
        organizationStatistics.cashProfitSum = cashProfitSum;
        organizationStatistics.onlinePurchaseCount = onlinePurchaseCount;
        organizationStatistics.cashPurchaseCount = cashPurchaseCount;
        organizationStatistics.onlinePurchaseSum = onlinePurchaseSum;
        organizationStatistics.cashPurchaseSum = cashPurchaseSum;
        organizationStatistics.withdrawnSum = withdrawnSum;
        organizationStatistics.paidToBankAccountSum = paidToBankAccountSum;
        organizationStatistics.depositPayoutSum = depositPayoutSum;
        organizationStatistics.operations = operations;
        organizationStatistics.onlinePaymentGatewaySum = onlinePaymentGatewaySum;
        organizationStatistics.cashPaymentGatewaySum = cashPaymentGatewaySum;


        const organizationStatisticsSaved = await this.organizationStatisticsRepo.save(organizationStatistics);
        if (organizationStatisticsSaved.isFailure) {
            console.log(organizationStatisticsSaved);
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization statistics'));
        }

        await this.updateClientStatistics(organizationId);

        return Result.ok(true);
    }

    private async updateClientStatistics(organizationId: string): Promise<Result<true | null, UseCaseError | null>> {
        const organizationClientsFound = await this.clientRepo.findByOrganization(organizationId.toString(), 1000, 1);
        if (organizationClientsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding clients'));
        }

        const organizationClients = organizationClientsFound.getValue()!;

        const clientStatsGotten = await this.organizationStatisticsService.getClientStats(organizationClients, organizationId);
        if (clientStatsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting client stats'));
        }

        const clientStats = clientStatsGotten.getValue()!;

        for (const client of clientStats) {
            client.stats.updatedAt = new Date();

            await this.clientRepo.save(client);
        }

        return Result.ok(true);
    }

    private async getOperations(purchases: IPurchaseWithStats[], wallet: IWallet): Promise<Result<IOrganizationStatisticsOperation[] | null, UseCaseError | null>> {
        const purchaseOperations = purchases;

        const depositTransactionsFound = await this.transactionRepo.findByTypeAndTo('deposit', wallet._id.toString());
        if (depositTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const depositTransactions = depositTransactionsFound.getValue()!;

        const withdrawalRequestsFound = await this.withdrawalRequestRepo.findByWalletAndSatisfied(wallet._id.toString(), true);
        if (withdrawalRequestsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding withdrawal requests'));
        }

        const withdrawalRequests = withdrawalRequestsFound.getValue()!;

        let operations: IOrganizationStatisticsOperation[] = [];

        for (const withdrawalRequest of withdrawalRequests) {
            operations.push({
                sum: Number(withdrawalRequest.sum.toFixed(2)),
                timestamp: withdrawalRequest.timestamp,
                type: 'withdrawal'
            });
        }

        for (const transaction of depositTransactions) {
            operations.push({
                sum: Number((transaction.sum).toFixed(2)),
                timestamp: transaction.timestamp,
                type: 'deposit'
            });
        }

        for (const purchase of (<IPurchaseWithStats[]>purchaseOperations)) {
            operations.push({
                firstLevel: Number(purchase.stats.firstLevel.toFixed(2)),
                sum: Number(purchase.sumInPoints.toFixed()),
                timestamp: purchase.timestamp,
                type: 'purchase',
                adwisePoints: Number(purchase.stats.adwisePoints.toFixed(2)),
                cashback: Number((purchase.stats.cashback).toFixed(2)),
                managerPoints: Number((purchase.stats.managerPoints).toFixed(2)),
                otherLevels: Number(purchase.stats.otherLevels.toFixed(2))
            });
        }

        operations = operations.sort((a, b) => a.timestamp.getTime() > b.timestamp.getTime() ? -1 : 1);

        return Result.ok(operations);
    }

    private async getOrganizationStatistics(organizationId: string): Promise<Result<IOrganizationStatistics | null, UseCaseError | null>> {
        let organizationStatistics: IOrganizationStatistics;
        
        const organizationStatisticsFound = await this.organizationStatisticsRepo.findByOrganization(organizationId);
        if (organizationStatisticsFound.isFailure && organizationStatisticsFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization statistics'));
        }

        if (organizationStatisticsFound.isFailure && organizationStatisticsFound.getError()!.code == 404) {
            organizationStatistics = new OrganizationStatisticsModel({
                organization: organizationId
            });

            const organizationStatisticsSaved = await this.organizationStatisticsRepo.save(organizationStatistics);
            if (organizationStatisticsSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving organization statistics'));
            }
        } else {
            organizationStatistics = organizationStatisticsFound.getValue()!;
        }

        return Result.ok(organizationStatistics!);
    }

}