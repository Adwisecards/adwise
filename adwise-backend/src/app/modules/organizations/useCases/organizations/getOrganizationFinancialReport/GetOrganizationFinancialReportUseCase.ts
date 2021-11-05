import { date } from "joi";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { IPDFService } from "../../../../../services/pdfService/IPDFService";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationStatisticsService } from "../../../services/organizations/organizationStatisticsService/IOrganizationStatisticsService";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { GetOrganizationPurchasesDTO } from "../getOrganizationPurchases/GetOrganizationPurchasesDTO";
import { GetOrganizationPurchasesUseCase } from "../getOrganizationPurchases/GetOrganizationPurchasesUseCase";
import { GetOrganizationFinancialReportDTO } from "./GetOrganizationFinancialReportDTO";
import { getOrganizationFinancialReportErrors } from "./getOrganizationFinancialReportErrors";

export class GetOrganizationFinancialReportUseCase implements IUseCase<GetOrganizationFinancialReportDTO.Request, GetOrganizationFinancialReportDTO.Response> {
    private pdfService: IPDFService;
    private mediaService: IMediaService;
    private organizationRepo: IOrganizationRepo;
    private organizationValidationService: IOrganizationValidationService;
    private organizationStatisticsService: IOrganizationStatisticsService;

    public errors = getOrganizationFinancialReportErrors;

    constructor(
        pdfService: IPDFService,
        mediaService: IMediaService,
        organizationRepo: IOrganizationRepo,
        organizationValidationService: IOrganizationValidationService,
        organizationStatisticsService: IOrganizationStatisticsService
        
    ) {
        this.pdfService = pdfService;
        this.mediaService = mediaService;
        this.organizationRepo = organizationRepo;
        this.organizationValidationService = organizationValidationService;
        this.organizationStatisticsService = organizationStatisticsService;
    }

    public async execute(req: GetOrganizationFinancialReportDTO.Request): Promise<GetOrganizationFinancialReportDTO.Response> {
        const valid = this.organizationValidationService.getOrganizationFinancialReport(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'))
        }

        const organization = organizationFound.getValue()!;

        const dateFrom = new Date(req.dateFrom);
        
        const dateTo = new Date(req.dateTo);

        const financialStatisticsCalculated = await this.organizationStatisticsService.collectFinancialStatistics(req.organizationId, dateFrom, dateTo);
        if (financialStatisticsCalculated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon calculating financial statistics'));
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

        const financialReportGenerated = await this.pdfService.generatePDF('financialReport', {
            organizationName: organization.legal.info.fullName || organization.legal.info.organizationName || organization.name || '_',
            ceoFullName: `${organization.legal.info.ceoLastName || '_'} ${organization.legal.info.ceoFirstName || '_'} ${organization.legal.info.ceoMiddleName || '_'}` || '_',
            
            dateFromDate: dateFrom.getDate(),
            dateFromMonth: this.formatMonth(dateFrom.getMonth()),
            dateFromYear: dateFrom.getFullYear(),
            dateToDate: dateTo.getDate(),
            dateToMonth: this.formatMonth(dateTo.getMonth()),
            dateToYear: dateTo.getFullYear(),

            packetDateFromDate: organization.packet.timestamp.getDate(),
            packetDateFromMonth: this.formatMonth(organization.packet.timestamp.getMonth()),
            packetDateFromYear: organization.packet.timestamp.getFullYear(),
            packetDateToDate: organization.packet.timestamp.getDate(),
            packetDateToMonth: this.formatMonth(organization.packet.timestamp.getMonth()),
            packetDateToYear: organization.packet.timestamp.getFullYear()+1,

            purchaseSum: (cashPurchaseSum + onlinePurchaseSum).toFixed(2),
            cashbackSum: (cashCashbackSum + onlineCashbackSum).toFixed(2),
            adwiseSum: (cashAdwiseSum + onlineAdwiseSum).toFixed(2),
            refFirstLevelSum: (cashRefFirstLevelSum + onlineRefFirstLevelSum).toFixed(2),
            refOtherLevelSum: (cashRefOtherLevelSum + cashRefOtherLevelSum).toFixed(2),
            profitSum: Number((onlineProfitSum + cashProfitSum).toFixed(2)),
            withdrawalSum: withdrawnSum,
            jp: (organization.legal.form == 'ooo'),
            ip: (organization.legal.form == 'ip'),
            individual: (organization.legal.form == 'individual')
        });

        if (financialReportGenerated.isFailure) {
            console.log(financialReportGenerated.getError()!);
            return Result.fail(UseCaseError.create('a', 'Error upon generating pdf'));
        }

        const financialReport = financialReportGenerated.getValue()!;

        const financialReportSaved = await this.mediaService.save(organization._id+'_financial_report_'+dateFrom.toString()+'-'+dateTo.toString()+'.pdf', financialReport);
        if (financialReportSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving financial report'));
        }

        const url = financialReportSaved.getValue()!;

        console.log(url);

        organization.lastFinancialReport = url;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok({
            organizationId: organization._id.toString()
        });
    }

    private formatMonth(month: number): string {
        const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

        return months[month];
    }
}