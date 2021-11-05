import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { FindAllPurchasesDTO } from "../../../../administration/useCases/globals/findAllPurchases/FindAllPurchasesDTO";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { IWithdrawalRequestRepo } from "../../../../finance/repo/withdrawalRequests/IWithdrawalRequestRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { GetOrganizationPurchasesDTO } from "../getOrganizationPurchases/GetOrganizationPurchasesDTO";
import { GetOrganizationPurchasesUseCase } from "../getOrganizationPurchases/GetOrganizationPurchasesUseCase";
import { GetOrganizationOperationsDTO } from "./GetOrganizationOperationsDTO";
import { getOrganizationOperationsErrors } from "./getOrganizationOperationsErrors";
import moment from 'moment';
import { IXlsxService } from "../../../../../services/xlsxService/IXlsxService";
import { date } from "joi";
import { GetOrganizationStatisticsUseCase } from "../../organizationStatistics/getOrganizationStatistics/GetOrganizationStatisticsUseCase";

export class GetOrganizationOperationsUseCase implements IUseCase<GetOrganizationOperationsDTO.Request, GetOrganizationOperationsDTO.Response> {
    private transactionRepo: ITransactionRepo;
    private getOrganizationPurchasesUseCase: GetOrganizationPurchasesUseCase;
    private organizationRepo: IOrganizationRepo;
    private withdrawalRequestRepo: IWithdrawalRequestRepo;
    private xlsxService: IXlsxService;
    private getOrganizationStatisticsUseCase: GetOrganizationStatisticsUseCase;

    public errors = [
        ...getOrganizationOperationsErrors
    ];

    constructor(
        transactionRepo: ITransactionRepo, 
        getOrganizationPurchasesUseCase: GetOrganizationPurchasesUseCase, 
        organizationRepo: IOrganizationRepo, 
        withdrawalRequestRepo: IWithdrawalRequestRepo,
        xlsxService: IXlsxService,
        getOrganizationStatisticsUseCase: GetOrganizationStatisticsUseCase
    ) {
        this.transactionRepo = transactionRepo;
        this.getOrganizationPurchasesUseCase = getOrganizationPurchasesUseCase;
        this.organizationRepo = organizationRepo;
        this.withdrawalRequestRepo = withdrawalRequestRepo;
        this.xlsxService = xlsxService;
        this.getOrganizationStatisticsUseCase = getOrganizationStatisticsUseCase;
    }

    public async execute(req: GetOrganizationOperationsDTO.Request): Promise<GetOrganizationOperationsDTO.Response> {
        if (req.limit < 0 || req.page < 0 || !Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const organizationStatisticsGotten = await this.getOrganizationStatisticsUseCase.execute({
            organizationId: req.organizationId
        });

        if (organizationStatisticsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting organization statistics'));
        }

        let { organizationStatistics: {operations} } = organizationStatisticsGotten.getValue()!;

        if (req.dateFrom) {
            const dateFrom = new Date(req.dateFrom);
            operations = operations.filter(o => o.timestamp.getTime() > dateFrom.getTime());
        }

        if (req.dateTo) {
            const dateTo = new Date(req.dateTo);
            operations = operations.filter(o => o.timestamp.getTime() < dateTo.getTime());
        }

        const start = (req.page-1) * req.limit;
        const end = start + req.limit;

        operations = operations.sort((a, b) => a.timestamp.getTime() > b.timestamp.getTime() ? -1 : 1);

        if (req.export) {
            const purchaseExported = await this.exportToXlsx(operations);
            if (purchaseExported.isFailure) {
                return Result.fail(purchaseExported.getError()!);
            }

            const xlsx = purchaseExported.getValue()!;

            return Result.ok({operations: xlsx as any, count: 0});
        }

        return Result.ok({operations: operations.slice(start, end), count: operations.length});
    }

    private async exportToXlsx(purchases: GetOrganizationOperationsDTO.IOperation[]): Promise<Result<Buffer | null, UseCaseError | null>>{       
        const xlsxGenerated = await this.xlsxService.convert(purchases.map(o => {
            const timestamp = moment(o.timestamp).format('DD.MM.YYYY HH:mm');

            return {
                'Дата': timestamp,
                'Тип операции': o.type == 'purchase' ? 'Покупка' : 'Вывод',
                'Кэшбэк': o.cashback ? o.cashback + ' ₽' : '-',
                '1 уровень': o.firstLevel ? o.firstLevel + ' ₽' : '-',
                '2—21 уровни': o.otherLevels ? o.otherLevels + ' ₽' : '-',
                'Сумма AdWise': o.adwisePoints ? o.adwisePoints + ' ₽' : '-',
                'Менеджер AdWise': o.managerPoints ? o.managerPoints + ' ₽' : '-',
                'Сумма': o.sum + ' ₽',
            };
        }));
        
        if (xlsxGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
        }

        const xlsx = xlsxGenerated.getValue()!;

        return Result.ok(xlsx);
    }
}