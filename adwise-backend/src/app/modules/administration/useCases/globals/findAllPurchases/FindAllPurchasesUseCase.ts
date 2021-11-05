import { FindAllPurchasesDTO } from "./FindAllPurchasesDTO";
import { findAllPurchasesErrors } from "./findAllPurchasesErrors";
import moment from 'moment';
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IXlsxService } from "../../../../../services/xlsxService/IXlsxService";
import { IPurchase } from "../../../../finance/models/Purchase";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { IOrganizationStatisticsService, IPurchaseWithStats } from "../../../../organizations/services/organizations/organizationStatisticsService/IOrganizationStatisticsService";
import { IPayment } from "../../../../finance/models/Payment";

export class FindAllPurchasesUseCase implements IUseCase<FindAllPurchasesDTO.Request, FindAllPurchasesDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private administrationValidationService: IAdministrationValidationService;
    private xlsxService: IXlsxService;
    private organizationStatisticsService: IOrganizationStatisticsService;

    public errors = [
        ...findAllPurchasesErrors
    ];

    constructor(
        purchaseRepo: IPurchaseRepo, 
        administrationValidationService: IAdministrationValidationService, 
        xlsxService: IXlsxService,
        organizationStatisticsService: IOrganizationStatisticsService
    ) {
        this.purchaseRepo = purchaseRepo;
        this.administrationValidationService = administrationValidationService;
        this.xlsxService = xlsxService
        this.organizationStatisticsService = organizationStatisticsService;
    }

    public async execute(req: FindAllPurchasesDTO.Request): Promise<FindAllPurchasesDTO.Response> {
        const valid = this.administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const parameterNames: string[] = [];
        const parameterValues: string[] = [];

        for (const key in req) {
            if (key == 'sortBy' || key == 'order' || key == 'pageSize' || key == 'pageNumber' || key == 'export' || key == 'total') continue;
            
            parameterNames.push(key);
            parameterValues.push((<any>req)[key]);
        }

        console.log(parameterNames, parameterValues);

        let purchases: IPurchase[];

        if (!req.export && !req.total) {
            const purchasesFound = await this.purchaseRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'purchaser user cashier organization payment');
            if (purchasesFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
            }

            purchases = purchasesFound.getValue()!;
        } else {
            const purchasesFound = await this.purchaseRepo.search(parameterNames, parameterValues, req.sortBy, req.order, 100000, 1, 'purchaser user cashier organization payment');
            if (purchasesFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
            }

            purchases = purchasesFound.getValue()!;
        }

        console.log(purchases);

        const purchasesWithStatsGotten = await this.organizationStatisticsService.getPurchasesWithStats(purchases);
        if (purchasesWithStatsGotten.isFailure) {
            return Result.fail(purchasesWithStatsGotten.getError());
        }

        const purchasesWithStats = purchasesWithStatsGotten.getValue()!;
        
        if (req.total) {
            const cashPurchases = purchasesWithStats.filter(p => (<any>p.payment)?.cash);
            const onlinePurchases = purchasesWithStats.filter(p => !(<any>p.payment)?.cash);

            const totalStats: FindAllPurchasesDTO.IStats = {
                adwisePoints: Number(purchasesWithStats.reduce((sum, cur) => sum += cur.stats.adwisePoints, 0).toFixed(2)),
                cashback: Number(purchasesWithStats.reduce((sum, cur) => sum += cur.stats.cashback, 0).toFixed(2)),
                otherLevels: Number(purchasesWithStats.reduce((sum, cur) => sum += cur.stats.otherLevels, 0).toFixed(2)),
                firstLevel: Number(purchasesWithStats.reduce((sum, cur) => sum += cur.stats.firstLevel, 0).toFixed(2)),
                managerPoints: Number(purchasesWithStats.reduce((sum, cur) => sum += cur.stats.managerPoints, 0).toFixed(2)),
                marketingSum: Number(purchasesWithStats.reduce((sum, cur) => sum += cur.stats.marketingSum, 0).toFixed(2)),
                paymentGatewayPoints: Number(purchasesWithStats.reduce((sum, cur) => sum += cur.stats.paymentGatewayPoints, 0).toFixed(2)),
                purchaseSum: Number(purchasesWithStats.reduce((sum, cur) => sum += cur.sumInPoints, 0).toFixed(2)),
                purchaseCount: purchasesWithStats.length,
                cashPurchaseCount: cashPurchases.length,
                onlinePurchaseCount: onlinePurchases.length,
                cashPurchaseSum: cashPurchases.reduce((sum, cur) => sum += cur.sumInPoints, 0),
                onlinePurchaseSum: onlinePurchases.reduce((sum, cur) => sum += cur.sumInPoints, 0),
                cashOrganizationPoints: Number(cashPurchases.reduce((sum, cur) => sum += cur.stats.organizationPoints, 0).toFixed(2)),
                onlineOrganizationPoints: Number(onlinePurchases.reduce((sum, cur) => sum += cur.stats.organizationPoints, 0).toFixed(2))
            };

            return Result.ok({stats: totalStats, purchases: [], count: -1});
        }

        if (req.export) {
            const xlsxGenerated = await this.xlsxService.convert(purchasesWithStats.map(p => {
                const purchase = p as IPurchaseWithStats;

                const date = moment(purchase.timestamp).format("DD.MM.YYYY / HH:mm");

                return {
                    'Дата / время': date,
                    'ID покупки': purchase._id.toString(),
                    'ID сделки': purchase.ref.code,
                    'Купон': purchase.coupons.reduce((coupons, cur) => coupons += cur.name + '\n', '').trim(),
                    'Сумма': purchase.sumInPoints + ' ₽',
                    'Продавец(орг)': (<any>purchase.organization).name,
                    'Покупатель': purchase.purchaser ? ((<any>purchase.purchaser).firstName.value + ((<any>purchase.purchaser).lastName ? ' '+(<any>purchase.purchaser).lastName.value : '')) : '',
                    'Кассир': (<any>purchase.cashier).firstName.value + ((<any>purchase.cashier).lastName.value ? ' '+(<any>purchase.cashier).lastName.value : ''),
                    'Статус сделки': this.formatPurchaseStatus(purchase),
                    'Кэшбэк': purchase.stats.cashback + ' ₽',
                    '1 уровень': purchase.stats.firstLevel + ' ₽',
                    '1-21 уровень': purchase.stats.otherLevels + ' ₽',
                    'Сумма AdWise': purchase.stats.adwisePoints + ' ₽',
                    'Сумма менеджера AdWise': purchase.stats.managerPoints + ' ₽',
                    'Комиссия платежного шлюза': purchase.stats.paymentGatewayPoints + ' ₽', 
                    'Прибыль': purchase.stats.organizationPoints + ' ₽',
                    'Тип терминала': this.formatPurchaseTerminal((<any>purchase.payment) as IPayment)
                };
            }));
            
            if (xlsxGenerated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
            }
    
            const xlsx = xlsxGenerated.getValue()!;

            return Result.ok({purchases: xlsx as any, count: -1});
        }

        const countFound = await this.purchaseRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({purchases: purchasesWithStats, count,});
    }

    private formatPurchaseStatus(purchase: IPurchase): string {
        if (purchase.canceled) return 'Отменен';
        else if (purchase.complete && purchase.confirmed && !purchase.processing) return 'Завершен';
        else if (!purchase.complete && purchase.confirmed && !purchase.processing) return 'Оплачен';
        else return 'В процессе';
    }

    private formatPurchaseTerminal(payment: IPayment): string {
        try {
            if (!payment) return '-';
            else if (payment?.safe) return 'Безопасная сделка';
            else if (payment?.split) return 'Сплитование';
            else if (payment?.cash) return 'Наличные';
            else return 'Классический терминал';
        } catch (ex) {
            console.log(ex);
            return '';
        }
    }
}