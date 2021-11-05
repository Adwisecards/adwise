import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import MimeType from "../../../../../core/static/MimeTypes";
import { IPDFService } from "../../../../../services/pdfService/IPDFService";
import { CreateMediaUseCase } from "../../../../media/useCases/createMedia/CreateMediaUseCase";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IPacket } from "../../../../organizations/models/Packet";
import { legalInfoRequestRepo } from "../../../../organizations/repo/legalInfoRequests";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IOrganizationStatisticsService } from "../../../../organizations/services/organizations/organizationStatisticsService/IOrganizationStatisticsService";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ILegal } from "../../../models/Legal";
import { IIndividualLegalInfo } from "../../../models/legalInfo/IndividualLegalInfo";
import { IIpLegalInfo } from "../../../models/legalInfo/IpLegalInfo";
import { IOrganizationDocument, OrganizationDocumentModel } from "../../../models/OrganizationDocument";
import { ILegalRepo } from "../../../repo/legal/ILegalRepo";
import { IOrganizationDocumentRepo } from "../../../repo/organizationDocuments/IOrganizationDocumentRepo";
import { IOrganizationDocumentValidationService } from "../../../services/organizationDocuments/organizationDocumentValidationService/IOrganizationDocumentValidationService";
import { GenerateOrganizationDocumentDTO } from "./GenerateOrganizationDocumentDTO";
import { generateOrganizationDocumentErrors } from "./generateOrganizationDocumentErrors";

interface IKeyObjects {
    user: IUser;
    legal: ILegal;
    userManager?: IUser;
    organization: IOrganization;
};

export class GenerateOrganizationDocumentUseCase implements IUseCase<GenerateOrganizationDocumentDTO.Request, GenerateOrganizationDocumentDTO.Response> {
    private userRepo: IUserRepo;
    private legalRepo: ILegalRepo;
    private pdfService: IPDFService;
    private organizationRepo: IOrganizationRepo;
    private createMediaUseCase: CreateMediaUseCase;
    private organizationDocumentRepo: IOrganizationDocumentRepo;
    private organizationStatisticsService: IOrganizationStatisticsService;
    private organizationDocumentValidationService: IOrganizationDocumentValidationService;

    public errors = generateOrganizationDocumentErrors;

    constructor(
        userRepo: IUserRepo,
        legalRepo: ILegalRepo,
        pdfService: IPDFService,
        organizationRepo: IOrganizationRepo,
        createMediaUseCase: CreateMediaUseCase,
        organizationDocumentRepo: IOrganizationDocumentRepo,
        organizationStatisticsService: IOrganizationStatisticsService,
        organizationDocumentValidationService: IOrganizationDocumentValidationService
    ) {
        this.userRepo = userRepo;
        this.legalRepo = legalRepo;
        this.pdfService = pdfService;
        this.organizationRepo = organizationRepo;
        this.createMediaUseCase = createMediaUseCase;
        this.organizationDocumentRepo = organizationDocumentRepo;
        this.organizationStatisticsService = organizationStatisticsService;
        this.organizationDocumentValidationService = organizationDocumentValidationService;
    }

    public async execute(req: GenerateOrganizationDocumentDTO.Request): Promise<GenerateOrganizationDocumentDTO.Response> {
        const valid = this.organizationDocumentValidationService.generateOrganizationDocumentData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.organizationId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            organization,
            user,
            legal,
            userManager
        } = keyObjectsGotten.getValue()!;

        if (organization.user.toString() != user._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        const organizationDocumentGenerated = await this.generateOrganizationDocument(req.type, organization, legal, userManager, req.options);
        if (organizationDocumentGenerated.isFailure) {
            return Result.fail(organizationDocumentGenerated.getError());
        }

        const organizationDocumentData = organizationDocumentGenerated.getValue()!;

        const organizationDocumentUpdated = await this.updateOrganizationDocument(organization._id.toString(), organizationDocumentData, req.type, req.options, req.asNew);
        if (organizationDocumentUpdated.isFailure) {
            return Result.fail(organizationDocumentUpdated.getError()!)
        }

        const organizationDocument = organizationDocumentUpdated.getValue()!;

        return Result.ok({organizationDocumentId: organizationDocument._id.toString()});
    }

    public async updateOrganizationDocument(organizationId: string, organizationDocumentData: Buffer, type: string, options?: GenerateOrganizationDocumentDTO.Options, asNew?: boolean): Promise<Result<IOrganizationDocument | null, UseCaseError | null>> {
        console.log('\n\n', asNew, '\n\n');

        const documentMediaCreated = await this.createMediaUseCase.execute({
            data: organizationDocumentData,
            type: 'image',
            mimeType: 'application/pdf'
        });

        if (documentMediaCreated.isFailure) {
            console.log('\n\n', documentMediaCreated, '\n\n');
            return Result.fail(UseCaseError.create('a', 'Error upon creating document media'));
        }

        const { mediaId: documentMediaId } = documentMediaCreated.getValue()!;
        
        let organizationDocument: IOrganizationDocument | undefined;

        const organizationDocumentFound = await this.organizationDocumentRepo.findByOrganizationAndType(organizationId, type);

        if (organizationDocumentFound.isFailure && organizationDocumentFound.getError()!.code == 500) {
            console.log(organizationDocumentFound);
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization document'));
        }
        
        if (asNew || (organizationDocumentFound.isFailure && organizationDocumentFound.getError()!.code == 404)) {
            organizationDocument = new OrganizationDocumentModel({
                type: type,
                documentMedia: documentMediaId,
                organization: organizationId,
                options: options
            });
        } else {
            organizationDocument = organizationDocumentFound.getValue()!;
            
            organizationDocument.documentMedia = new Types.ObjectId(documentMediaId);
            organizationDocument.updatedAt = new Date();
        }

        const organizationDocumentSaved = await this.organizationDocumentRepo.save(organizationDocument);
        if (organizationDocumentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization document'));
        }

        return Result.ok(organizationDocument);
    }

    private async generateOrganizationDocument(type: string, organization: IOrganization, legal: ILegal, manager?: IUser, options?: GenerateOrganizationDocumentDTO.Options): Promise<Result<Buffer | null, UseCaseError | null>> {
        switch (type) {
            case 'application':
                return await this.generateApplication(organization, legal, manager!);
            case 'packetPaymentAct':
                return await this.generatePacketPaymentAct(organization, legal);
            case 'treaty':
                return await this.generateTreaty();
            case 'financialReport':
                return await this.generateFinancialReport(organization, legal, new Date(options?.dateFrom!), new Date(options?.dateTo!));
            case 'withdrawalAct':
                return await this.generateWithdrawalAct(organization, legal, new Date(options?.dateFrom!), new Date(options?.dateTo!));
            default:
                return Result.fail(UseCaseError.create('a', 'Unknown type'));
        }
    }

    private async generateWithdrawalAct(organization: IOrganization, legal: ILegal, dateFrom: Date, dateTo: Date): Promise<Result<Buffer | null, UseCaseError | null>> {
        const financialStatisticsCalculated = await this.organizationStatisticsService.collectFinancialStatistics(organization._id.toString(), dateFrom, dateTo);
        if (financialStatisticsCalculated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon calculating financial statistics'));
        }

        console.log(dateFrom, dateTo);

        let {
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

        const withdrawalActName = this.getWithdrawalActName(legal.form);
        if (!withdrawalActName) {
            return Result.fail(UseCaseError.create('a', 'Cannot get packet payment act name'));
        }

        // calculated values

        const marketingSum = Number(((cashMarketingSum + onlineMarketingSum) + (cashCashbackSum + onlineCashbackSum) - (cashAdwiseSum + onlineAdwiseSum)).toFixed(2));
        // const profitSum = (purchaseSum) - marketingSum - adwiseSum;

        const withdrawalActGenerated = await this.pdfService.generatePDF(withdrawalActName, {
            organizationName: legal.info.organizationName || '_',
            ceoFullName: `${(<IIpLegalInfo>legal.info)?.ceo?.lastName || '_'} ${(<IIpLegalInfo>legal.info)?.ceo?.firstName || '_'} ${(<IIpLegalInfo>legal.info)?.ceo?.middleName || '_'}` || '_',
            
            inn: legal.info.inn,
            ogrn: legal.info.ogrn,
            kpp: (<IIpLegalInfo>legal.info).kpp || '-',
            
            dateFromDate: dateFrom.getDate(),
            dateFromMonth: this.formatMonth(dateFrom.getMonth()),
            dateFromYear: dateFrom.getFullYear(),
            dateToDate: dateTo.getDate(),
            dateToMonth: this.formatMonth(dateTo.getMonth()),
            dateToYear: dateTo.getFullYear(),

            purchaseSum: (cashPurchaseSum + onlinePurchaseSum).toFixed(2),
            cashbackSum: (cashCashbackSum + onlineCashbackSum).toFixed(2),
            adwiseSum: (cashAdwiseSum + onlineAdwiseSum).toFixed(2),
            refFirstLevelSum: (cashRefFirstLevelSum + onlineRefFirstLevelSum).toFixed(2),
            refOtherLevelSum: (cashRefOtherLevelSum + onlineRefOtherLevelSum).toFixed(2),
            profitSum: (onlineProfitSum + cashProfitSum).toFixed(2),
            withdrawalSum: withdrawnSum.toFixed(2),
            marketingSum: marketingSum.toFixed(2)
        });

        if (withdrawalActGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating withdrawal act'));
        }

        const withdrawalAct = withdrawalActGenerated.getValue()!;

        return Result.ok(withdrawalAct);
    }

    private async generateFinancialReport(organization: IOrganization, legal: ILegal, dateFrom: Date, dateTo: Date): Promise<Result<Buffer | null, UseCaseError | null>> {
        if (!organization.packet) {
            return Result.fail(UseCaseError.create('c', 'Not enough data provided'));
        }
        
        const financialStatisticsCalculated = await this.organizationStatisticsService.collectFinancialStatistics(organization._id.toString(), dateFrom, dateTo);
        if (financialStatisticsCalculated.isFailure) {
            console.log(financialStatisticsCalculated);
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
            inn: legal.info.inn,
            ogrn: legal.info.ogrn,
            kpp: (<IIpLegalInfo>legal.info).kpp || '',

            organizationName: legal.info.organizationName || '_',
            ceoFullName: `${(<IIpLegalInfo>legal.info)?.ceo?.lastName || '_'} ${(<IIpLegalInfo>legal.info)?.ceo?.firstName || '_'} ${(<IIpLegalInfo>legal.info)?.ceo?.middleName || '_'}` || '_',
            
            dateFromDate: dateFrom.getDate(),
            dateFromMonth: this.formatMonth(dateFrom.getMonth()),
            dateFromYear: dateFrom.getFullYear(),
            dateToDate: dateTo.getDate(),
            dateToMonth: this.formatMonth(dateTo.getMonth()),
            dateToYear: dateTo.getFullYear(),

            packetDateFromDate: organization.packet?.timestamp.getDate(),
            packetDateFromMonth: this.formatMonth(organization.packet?.timestamp.getMonth()),
            packetDateFromYear: organization.packet?.timestamp.getFullYear(),
            packetDateToDate: organization.packet?.timestamp.getDate(),
            packetDateToMonth: this.formatMonth(organization.packet?.timestamp.getMonth()),
            packetDateToYear: organization.packet?.timestamp.getFullYear()+1,

            purchaseSum: (cashPurchaseSum + onlinePurchaseSum).toFixed(2),
            cashbackSum: (cashCashbackSum + onlineCashbackSum).toFixed(2),
            adwiseSum: (cashAdwiseSum + onlineAdwiseSum).toFixed(2),
            refFirstLevelSum: (cashRefFirstLevelSum + onlineAdwiseSum).toFixed(2),
            refOtherLevelSum: (cashRefOtherLevelSum + onlineRefOtherLevelSum).toFixed(2),
            profitSum: (onlineProfitSum + cashProfitSum).toFixed(2),
            withdrawalSum: withdrawnSum,
            jp: (legal.form == 'ooo'),
            ip: (legal.form == 'ip'),
            individual: (legal.form == 'individual')
        });

        if (financialReportGenerated.isFailure) {
            console.log(financialReportGenerated.getError()!);
            return Result.fail(UseCaseError.create('a', 'Error upon generating pdf'));
        }

        const financialReport = financialReportGenerated.getValue()!;

        return Result.ok(financialReport);
    }

    private async generatePacketPaymentAct(organization: IOrganization, legal: ILegal): Promise<Result<Buffer | null, UseCaseError | null>> {
        if (!organization.packet) {
            return Result.fail(UseCaseError.create('c', 'Not enough data provided'));
        }

        const packetPaymentActName = this.getPacketPaymentActName(legal.form, organization.packet);
        if (!packetPaymentActName) {
            return Result.fail(UseCaseError.create('a', 'Cannot get packet payment act name'));
        }
        
        const packetPaymentActGenerated = await this.pdfService.generatePDF(packetPaymentActName, {            
            fullName: legal.info.organizationName,
                    
            packetDateFromDate: organization.packet.timestamp.getDate(),
            packetDateFromMonth: this.formatMonth(organization.packet.timestamp.getMonth()),
            packetDateFromYear: organization.packet.timestamp.getFullYear(),
            packetDateToDate: organization.packet.timestamp.getDate(),
            packetDateToMonth: this.formatMonth(organization.packet.timestamp.getMonth()),
            packetDateToYear: organization.packet.timestamp.getFullYear()+1,

            ceoFullName: `${(<IIpLegalInfo>legal.info)?.ceo?.lastName || '_'} ${(<IIpLegalInfo>legal.info)?.ceo?.firstName || '_'} ${(<IIpLegalInfo>legal.info)?.ceo?.middleName || '_'}` || '_',
        
            inn: legal.info.inn,
            kpp: (<IIpLegalInfo>legal.info).kpp || '',
            ogrn: legal.info.ogrn
        });

        if (packetPaymentActGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating packet payment act'));
        }

        const packetPaymentAct = packetPaymentActGenerated.getValue()!;
        

        return Result.ok(packetPaymentAct);
    }

    private async generateTreaty(): Promise<Result<Buffer | null, UseCaseError | null>> {
        const treatyGenerated = await this.pdfService.generatePDF(`treaty`, {});
        if (treatyGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating treaty'));
        }

        const treaty = treatyGenerated.getValue()!;

        return Result.ok(treaty);
    }

    private async generateApplication(organization: IOrganization, legal: ILegal, manager: IUser): Promise<Result<Buffer | null, UseCaseError | null>> {                
        const applicationGenerated = await this.pdfService.generatePDF(legal.form, {
            fullName: legal.info.organizationName,
            inn: legal.info.inn,
            ogrn: legal.info.ogrn,
            organizationName: organization.name,
            identityDocumentSerialNumber: (<IIpLegalInfo>legal.info).ceo?.document.serialNumber || (<IIndividualLegalInfo>legal.info).document?.serialNumber,
            identityDocumentDateIssue: this.formatDate((<IIpLegalInfo>legal.info).ceo?.document.issueDate || (<IIndividualLegalInfo>legal.info).document?.issueDate),
            identityDocumentIssuedBy: (<IIpLegalInfo>legal.info).ceo?.document.issuedBy || (<IIndividualLegalInfo>legal.info).document?.issuedBy,
            identityDocumentDepartmentCode: (<IIpLegalInfo>legal.info).ceo?.document.departmentCode || (<IIndividualLegalInfo>legal.info).document?.departmentCode,
            residenceAddressIndex: legal.info.addresses.legal.zip,
            residenceAddress: `${this.formatCountry(legal.info.addresses.legal.country)}, г. ${legal.info.addresses.legal.city}, ${legal.info.addresses.legal.street}`,
            phoneNumber: legal.info.phone,
            emailAddress: legal.info.email,
            bankAccount_bankName: legal.info.bankAccount.name,
            bankAccount_bik: legal.info.bankAccount.bik,
            bankAccount_korAccount: legal.info.bankAccount.korAccount,
            bankAccount_account: legal.info.bankAccount.account,
            packetName: organization.packet?.name || organization.requestedPacket?.name ||  '-',
            managerCode: manager?.ref?.code || '-'
        });

        if (applicationGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating application'));
        }

        const application = applicationGenerated.getValue()!;

        return Result.ok(application);
    }

    private async getKeyObjects(userId: string, organizationId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding organization") : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        let userManager: IUser | undefined;

        if (organization.manager) {
            const userManagerFound = await this.userRepo.findById(organization.manager.toString());
            if (userManagerFound.isFailure) {
                return Result.fail(userManagerFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding manager') : UseCaseError.create('m', 'Manager does not exist'));
            }

            userManager = userManagerFound.getValue()!;
        }

        const legalFound = await this.legalRepo.findByOrganizationAndRelevant(organization._id.toString(), true);
        if (legalFound.isFailure) {
            return Result.fail(legalFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding legal') : UseCaseError.create('b4'));
        }

        const legal = legalFound.getValue()!;

        return Result.ok({
            user,
            userManager,
            organization,
            legal
        });
    }

    private formatMonth(month: number): string {
        const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

        return months[month];
    }

    private getWithdrawalActName(legalForm: string): string {
        if (legalForm == 'ip') {
            return 'withdrawalActIp';
        }

        if (legalForm == 'individual') {
            return 'withdrawalActIndividual';
        }

        if ('ooo') {
            return 'withdrawalActJp'
        }

        return '';
    }

    private getPacketPaymentActName(legalForm: string, packet: IPacket): string {
        if (legalForm == 'ip' && packet.name.toLowerCase() == 'promo' && packet.asWisewinOption) {
            return 'promo25002IpWisewin';
        }

        if (legalForm == 'individual' && packet.name.toLowerCase() == 'promo' && packet.asWisewinOption) {
            return 'promo25002IndividualWisewin';
        }

        if (legalForm == 'ip' && packet.name.toLowerCase() == 'one' && packet.asWisewinOption) {
            return 'one400012IpWisewin';
        }

        if (legalForm == 'jp' && packet.name.toLowerCase() == 'one' && packet.asWisewinOption) {
            return 'one400012JpWisewin';
        }

        if (legalForm == 'individual' && packet.name.toLowerCase() == 'one' && packet.asWisewinOption) {
            return 'one400012IndividualWisewin';
        }
        
        if (legalForm == 'ip' && packet.name.toLowerCase() == 'full') {
            return 'full1200012Ip';
        }

        if (legalForm == 'individual' && packet.name.toLowerCase() == 'full') {
            return 'full1200012Individual';
        }

        if (legalForm == 'jp' && packet.name.toLowerCase() == 'full') {
            return 'full1200012Jp';
        }

        if (legalForm == 'ip' && packet.name.toLowerCase() == 'one') {
            return 'one400012Ip';
        }

        if (legalForm == 'individual' && packet.name.toLowerCase() == 'one') {
            return 'one400012Individual';
        }

        if (legalForm == 'Jp' && packet.name.toLowerCase() == 'one') {
            return 'one400012Jp';
        }

        if (legalForm == 'ip' && packet.name.toLowerCase() == 'promo') {
            return 'promo25002Ip';
        }

        if (legalForm == 'individual' && packet.name.toLowerCase() == 'promo') {
            return 'promo25002Individual';
        }

        if (legalForm == 'jp' && packet.name.toLowerCase() == 'promo') {
            return 'promo25002Jp';
        }

        return '';
    }

    private formatCountry(countryCode: string): string {
        const countryMap: Record<string, string> = {
            rus: 'Россия'
        };

        return countryMap[countryCode] || '';
    }

    private formatDate(date: Date): string {
        if (!date) {
            return '';
        }

        const year = date.getFullYear().toString();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();

        if (month.length == 1) {
            month = '0' + month;
        }

        if (day.length == 1) {
            day = '0' + day;
        }

        return `${day}.${month}.${year}`;
    }
}