import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IXlsxService } from "../../../../../services/xlsxService/IXlsxService";
import { FindAllPurchasesDTO } from "../../../../administration/useCases/globals/findAllPurchases/FindAllPurchasesDTO";
import { IPurchase } from "../../../../finance/models/Purchase";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { GetOrganizationPurchasesDTO } from "./GetOrganizationPurchasesDTO";
import { getOrganizationPurchasesErrors } from './getOrganizationPurchasesErrors';
import moment from 'moment';
import { IOrganizationStatisticsService, IPurchaseWithStats } from "../../../services/organizations/organizationStatisticsService/IOrganizationStatisticsService";

export class GetOrganizationPurchasesUseCase implements IUseCase<GetOrganizationPurchasesDTO.Request, GetOrganizationPurchasesDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private purchaseRepo: IPurchaseRepo;
    private organizationValidationService: IOrganizationValidationService;
    private xlsxService: IXlsxService;
    private organizationStatisticsService: IOrganizationStatisticsService;

    public errors: UseCaseError[] = [
        ...getOrganizationPurchasesErrors
    ];

    constructor(
        organizationRepo: IOrganizationRepo, 
        purchaseRepo: IPurchaseRepo, 
        organizationValidationService: IOrganizationValidationService,
        xlsxService: IXlsxService,
        organizationStatisticsService: IOrganizationStatisticsService
    ) {
        this.organizationRepo = organizationRepo;
        this.purchaseRepo = purchaseRepo;
        this.organizationValidationService = organizationValidationService;
        this.xlsxService = xlsxService;
        this.organizationStatisticsService = organizationStatisticsService;
    }

    public async execute(req: GetOrganizationPurchasesDTO.Request): Promise<GetOrganizationPurchasesDTO.Response> {
        const valid = this.organizationValidationService.getOrganizationPurchasesData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        if (req.export) {
            req.limit = 100000;
            req.page = 1;
        }

        let filter: Record<string, any>[] = [

        ];

        for (const type of req.types!) {
            const filterPass: Record<string, any> = {
                archived: false,
                canceled: false,
                shared: undefined
            };

            if (type == 'new') {
                filterPass.canceled = false
                filterPass.confirmed = false;
                filterPass.complete = false;
                filterPass.processing = false;
            }

            if (type == 'processing') {
                filterPass.canceled = false;
                filterPass.processing = true;
                filterPass.confirmed = false;
                filterPass.complete = false
            }

            if (type == 'confirmed') {
                filterPass.canceled = false;
                filterPass.confirmed = true;
                filterPass.complete = false;
                filterPass.processing = false
            }

            if (type == 'complete') {
                filterPass.canceled = false;
                filterPass.confirmed = true;
                filterPass.complete = true;
                filterPass.processing = false;
            }

            if (type == 'shared') {
                filterPass.shared = true;
                filterPass.complete = false;
            }

            if (type == 'archived') {
                filterPass.archived = true
            }

            if (type == 'canceled') {
                filterPass.canceled = true
            }

            filter.push(filterPass);
        }

        if (!filter.length) {
            filter.push({
                archived: false,
                canceled: false
            });
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organizations') : UseCaseError.create('l'));
        }

        const purchasesFound = await this.purchaseRepo.findByOrganizationAndFilter(req.organizationId, req.limit, req.page, filter, req.dateFrom, req.dateTo, req.sortBy || 'timestamp', req.order || -1, req.refCode, req.cashierContactId, req.purchaserContactId);
        if (purchasesFound.isFailure) {
            console.log(purchasesFound.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const purchases = purchasesFound.getValue()!;

        const purchasesWithStatsGotten = await this.organizationStatisticsService.getPurchasesWithStats(purchases);
        if (purchasesWithStatsGotten.isFailure) {
            return Result.fail(purchasesWithStatsGotten.getError());
        }

        const purchasesWithStats = purchasesWithStatsGotten.getValue()!;

        if (req.export) {
            const purchaseExported = await this.exportToXlsx(purchasesWithStats);
            if (purchaseExported.isFailure) {
                return Result.fail(purchaseExported.getError()!);
            }

            const xlsx = purchaseExported.getValue()!;

            return Result.ok({purchases: xlsx as any, count: 0});
        }

        const purchasesCounted = await this.purchaseRepo.countByOrganizationAndFilter(req.organizationId, filter, req.dateFrom, req.dateTo, req.refCode, req.cashierContactId, req.purchaserContactId);
        if (purchasesCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting purchases'));
        }

        const count = purchasesCounted.getValue()!;

        if (!req.multiple) {
            for (const purchase of purchasesWithStats) {
                purchase.offer = purchase.offers[0];
                purchase.coupon = purchase.coupons[0];
            }
        }

        return Result.ok({purchases: purchasesWithStats, count});
    }

    private async exportToXlsx(purchases: IPurchaseWithStats[]): Promise<Result<Buffer | null, UseCaseError | null>>{       
        const xlsxGenerated = await this.xlsxService.convert(purchases.map(p => {
            const timestamp = moment(p.timestamp).format('DD.MM.YYYY HH:mm');
            const paidAt = p.paidAt ? moment(p.paidAt).format('DD.MM.YYYY HH:mm') : '-';
            const completedAt = p.completedAt ? moment(p.completedAt).format('DD.MM.YYYY HH:mm') : '-';

            return {
                'Счёт': p.ref.code,
                'Купон': p.coupons.reduce((name, cur) => name += cur.name + ' ', '').trim(),
                'Тип операции': p.type == 'cash' ? 'Наличные' : 'Безналичные',
                'Дата создания': timestamp,
                'Дата оплаты': paidAt,
                'Дата завершения': completedAt,
                'Статус': this.formatPurchaseStatus(p),
                'Сумма': p.sumInPoints + ' ₽',
                'Кэшбэк': p.stats.cashback + ' ₽',
                'Маркетинг': p.stats.marketingSum + ' ₽',
                'Прибыль': p.stats.organizationPoints + ' ₽',
                'Клиент': p.purchaser ? ((<any>p.purchaser).firstName.value + ((<any>p.purchaser).lastName ? ' '+(<any>p.purchaser).lastName.value : '')) : '',
                'Кассир': p.cashier ? ((<any>p.cashier).firstName.value + ((<any>p.cashier).lastName ? ' '+(<any>p.cashier).lastName.value : '')) : ''
            };
        }));
        if (xlsxGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
        }

        const xlsx = xlsxGenerated.getValue()!;

        return Result.ok(xlsx);
    }

    private formatPurchaseStatus(purchase: IPurchase): string {
        if (purchase.canceled) return 'Отменен';
        else if (purchase.complete && purchase.confirmed && !purchase.processing) return 'Завершен';
        else if (!purchase.complete && purchase.confirmed && !purchase.processing) return 'Оплачен';
        else return 'В процессе';
    }
}