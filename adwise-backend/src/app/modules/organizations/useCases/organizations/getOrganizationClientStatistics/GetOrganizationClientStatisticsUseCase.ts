import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { IOrganization } from "../../../models/Organization";
import { IClientRepo } from "../../../repo/clients/IClientRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationStatisticsService } from "../../../services/organizations/organizationStatisticsService/IOrganizationStatisticsService";
import { GetOrganizationStatisticsUseCase } from "../../organizationStatistics/getOrganizationStatistics/GetOrganizationStatisticsUseCase";
import { GetOrganizationClientStatisticsDTO } from "./GetOrganizationClientStatisticsDTO";
import { getOrganizationClientStatisticsErrors } from "./getOrganizationClientStatisticsErrors";

export class GetOrganizationClientStatisticsUseCase implements IUseCase<GetOrganizationClientStatisticsDTO.Request, GetOrganizationClientStatisticsDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private clientRepo: IClientRepo;
    private getOrganizationStatisticsUseCase: GetOrganizationStatisticsUseCase;

    public errors = getOrganizationClientStatisticsErrors;

    constructor(
        organizationRepo: IOrganizationRepo, 
        clientRepo: IClientRepo,
        getOrganizationStatisticsUseCase: GetOrganizationStatisticsUseCase
    ) {
        this.organizationRepo = organizationRepo;
        this.clientRepo = clientRepo;
        this.getOrganizationStatisticsUseCase = getOrganizationStatisticsUseCase;
    }

    public async execute(req: GetOrganizationClientStatisticsDTO.Request): Promise<GetOrganizationClientStatisticsDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId is not valid'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        return this.getStatistics(organization);
    }

    private async getStatistics(organization: IOrganization): Promise<GetOrganizationClientStatisticsDTO.Response> {
        // const clients = organization.clients.map(c => c.toHexString());

        const organizationStatisticsGotten = await this.getOrganizationStatisticsUseCase.execute({
            organizationId: organization._id.toString()
        });
        if (organizationStatisticsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization statistics'));
        }

        const { organizationStatistics } = organizationStatisticsGotten.getValue()!;

        const clientsCounted = await this.clientRepo.count(['organization'], [organization._id.toString()]);
        if (clientsCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting clients'));
        }

        const clientCount = clientsCounted.getValue()!;

        return Result.ok({
            clientCount,
            purchaseSum: Number((organizationStatistics.cashPurchaseSum + organizationStatistics.onlinePurchaseSum).toFixed(2)),
            purchaserCount: organizationStatistics.cashPurchaseCount + organizationStatistics.onlinePurchaseCount
        });
   }
}