import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IXlsxService } from "../../../../../services/xlsxService/IXlsxService";
import { IContact } from "../../../../contacts/models/Contact";
import { IClient } from "../../../models/Client";
import { IOrganization } from "../../../models/Organization";
import { IClientRepo } from "../../../repo/clients/IClientRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationStatisticsService } from "../../../services/organizations/organizationStatisticsService/IOrganizationStatisticsService";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { GetOrganizationClientsDTO } from "./GetOrganizationClientsDTO";
import { getOrganizationClientsErrors } from "./getOrganizationClientsErrors";

export class GetOrganizationClientsUseCase implements IUseCase<GetOrganizationClientsDTO.Request, GetOrganizationClientsDTO.Response> {
    private clientRepo: IClientRepo;
    private organizationRepo: IOrganizationRepo;
    private organizationValidationService: IOrganizationValidationService;
    private xlsxService: IXlsxService;
    private organizationStatisticsService: IOrganizationStatisticsService;

    public errors: UseCaseError[] = getOrganizationClientsErrors;

    constructor(
        clientRepo: IClientRepo, 
        organizationRepo: IOrganizationRepo, 
        organizationValidationService: IOrganizationValidationService,
        xlsxService: IXlsxService,
        organizationStatisticsService: IOrganizationStatisticsService
        ) {
        this.clientRepo = clientRepo;
        this.organizationRepo = organizationRepo;
        this.organizationValidationService = organizationValidationService;
        this.xlsxService = xlsxService;
        this.organizationStatisticsService = organizationStatisticsService;
    }

    public async execute(req: GetOrganizationClientsDTO.Request): Promise<GetOrganizationClientsDTO.Response> {
        const valid = this.organizationValidationService.getOrganizationClientsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            console.log(organizationFound.getError());
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        if (req.export) {
            req.page = 1;
            req.limit = 10000;
        }

        const clientsFound = await this.clientRepo.searchByOrganization(req.organizationId, req.search || '.', req.limit, req.page, req.sortBy || '_id' , req.order || -1);
        if (clientsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding clients'));
        }

        const clients = clientsFound.getValue()!;

        // const clientsWithStatsGotten = await this.organizationStatisticsService.getClientsWithStats(clients, organization._id.toString());
        // if (clientsWithStatsGotten.isFailure) {
        //     console.log(clientsWithStatsGotten.getError());
        //     return Result.fail(UseCaseError.create('a', 'Error upon getting clients with statistics'));
        // }

        // const clients = clientsWithStatsGotten.getValue()!;

        if (req.export) {
            const clientsExported = await this.exportToXlsx(clients);
            if (clientsExported.isFailure) {
                return Result.fail(clientsExported.getError()!);
            }

            const xlsx = clientsExported.getValue()!;

            return Result.ok({clients: xlsx as any, count: 0});
        }

        const clientsCounted = await this.clientRepo.countByOrganization(organization._id.toString(), req.search || '.');
        if (clientsCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting clients'));
        }

        const count = clientsCounted.getValue()!;

        return Result.ok({clients: clients, count});
    }

    private async exportToXlsx(clients: IClient[]): Promise<Result<Buffer | null, UseCaseError | null>>{
        const xlsxGenerated = this.xlsxService.convert(clients.map(c => {
            return {
                'Клиент': `${(<IContact>(<any>c.contact)).firstName.value} ${(<IContact>(<any>c.contact)).lastName.value}`,
                'Кол-во чеков': c.stats.purchaseCount.toString(),
                'Рекомендации': c.refCount.toString(),
                'Кэшбэк': c.stats.cashbackSum.toFixed(2) + '₽',
                'Сумма покупок': c.stats.purchaseSum.toFixed(2) + '₽',
                'Телефон': (<IContact>(<any>c.contact)).phone.value,
                'Эл. адрес': (<IContact>(<any>c.contact)).email.value
            };
        }));

        if (xlsxGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
        }

        const xlsx = xlsxGenerated.getValue()!;

        return Result.ok(xlsx);
    }
}