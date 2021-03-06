import moment from "moment";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IXlsxService } from "../../../../../services/xlsxService/IXlsxService";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { ITransactionRepo } from "../../../../finance/repo/transactions/ITransactionRepo";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { GetOrganizationStatisticsUseCase } from "../../../../organizations/useCases/organizationStatistics/getOrganizationStatistics/GetOrganizationStatisticsUseCase";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllOrganizationsDTO } from "./FindAllOrganizationsDTO";

export class FindAllOrganizationsUseCase implements IUseCase<FindAllOrganizationsDTO.Request, FindAllOrganizationsDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private administrationValidationService: IAdministrationValidationService;
    private xlsxService: IXlsxService;
    private transactionRepo: ITransactionRepo;
    private getOrganizationStatisticsUseCase: GetOrganizationStatisticsUseCase;
    public errors: UseCaseError[] = [

    ];
    constructor(
        administrationValidationService: IAdministrationValidationService, 
        organizationRepo: IOrganizationRepo, 
        xlsxService: IXlsxService, 
        transactionRepo: ITransactionRepo, 
        getOrganizationStatisticsUseCase: GetOrganizationStatisticsUseCase
    ) {
        this.organizationRepo = organizationRepo;
        this.administrationValidationService = administrationValidationService;
        this.xlsxService = xlsxService;
        this.transactionRepo = transactionRepo;
        this.getOrganizationStatisticsUseCase = getOrganizationStatisticsUseCase;
    }

    public async execute(req: FindAllOrganizationsDTO.Request): Promise<FindAllOrganizationsDTO.Response> {
        const valid = this.administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const parameterNames: string[] = [];
        const parameterValues: string[] = [];

        for (const key in req) {
            if (key == 'sortBy' || key == 'order' || key == 'pageSize' || key == 'pageNumber' || key == 'export') continue;
            parameterNames.push(key);
            parameterValues.push((<any>req)[key]);
        }

        let organizations: IOrganization[];

        if (!req.export) {
            console.log(parameterNames, parameterValues);
            const organizationsFound = await this.organizationRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'wallet manager user');
            if (organizationsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
            }
            organizations = organizationsFound.getValue()!;
        } else {
            const organizationsFound = await this.organizationRepo.search(parameterNames, parameterValues, req.sortBy, req.order, 10000000, 1, 'wallet manager user');
            if (organizationsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
            }
            organizations = organizationsFound.getValue()!;
        }

        const organizationsWithStats: FindAllOrganizationsDTO.IOrganizationWithStats[] = [];

        for (const organization of organizations!) {
            const organizationStatisticsGotten = await this.getOrganizationStatisticsUseCase.execute({
                organizationId: organization._id.toString()
            });

            if (organizationStatisticsGotten.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting financial statistics'));
            }

            const { organizationStatistics } = organizationStatisticsGotten.getValue()!;

            organizationsWithStats.push({
                ...organization.toObject(),
                stats: organizationStatistics 
            });
        }

        if (req.export) {
            const xlsxGenerated = await this.xlsxService.convert(organizationsWithStats.map(o => {
                const org = o as FindAllOrganizationsDTO.IOrganizationWithStats;

                const date = org.packet ? moment(org.packet.timestamp).add('1', 'year').format('DD.MM.YYYY HH:mm') : '-';
                return {
                    '????????????????': org.name,
                    '????????????????': org.user ? ((<any>org.user).firstName + ((<any>org.user).lastName ? ' '+(<any>org.user).lastName : '')) : '',
                    '?????????? ????????????????????????': org.user ? (<any>org.user).email : '-',
                    '?????????????? ????????????????????????': org.user ? (<any>org.user).phone : '-',
                    '??????????????????': org.category.name,
                    '????????????': 'https://adwise.cards/organization/'+org._id.toString(),
                    '????????????': (<any>org.wallet)?.points || 0 + ' ???',
                    '?? ????????????????????': (<any>org.wallet)?.frozenPointsSum || 0 + ' ???',
                    '??????????????': (<any>org.wallet)?.deposit || 0 + ' ???',
                    '????????????????': org.manager ? ((<any>org.manager).firstName + ((<any>org.manager).lastName ? ' '+(<any>org.manager).lastName : '')) : '',
                    '??????????': org.packet ? org.packet.name : '-',
                    '???????? ??????????????????': date,
                    'ID ????????????????': (<any>org.wallet)._id.toString(),
                    '??????-???? ??????????????': org.stats.onlinePurchaseCount + org.stats.cashPurchaseCount,
                    '??????????????????': org.stats.withdrawnSum + ' ???',
                    '?????????? ??????????????????': org.stats.onlineProfitSum + org.stats.cashProfitSum + ' ???',
                    '?????????????????? ??????????????????': org.stats.cashProfitSum + ' ???',
                    '?????????????????? ????????????': org.stats.onlineProfitSum + ' ???',
                    '?????????????????? ???? ????????': org.stats.paidToBankAccountSum + ' ???',
                    '??????????????': org.treaty || '-'
                };
            }));
            if (xlsxGenerated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
            }
    
            const xlsx = xlsxGenerated.getValue()!;

            return Result.ok({organizations: xlsx as any, count: -1});
        }

        const countFound = await this.organizationRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({organizations: organizationsWithStats, count});
    }
}