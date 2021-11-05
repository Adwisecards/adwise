import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IClientRepo } from "../../../repo/clients/IClientRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationStatisticsService } from "../../../services/organizations/organizationStatisticsService/IOrganizationStatisticsService";
import { GetOrganizationClientDTO } from "./GetOrganizationClientDTO";
import { getOrganizationClientErrors } from "./getOrganizationClientErrors";

export class GetOrganizationClientUseCase implements IUseCase<GetOrganizationClientDTO.Request, GetOrganizationClientDTO.Response> {
    private clientRepo: IClientRepo;
    private organizationStatisticsService: IOrganizationStatisticsService;

    public errors: UseCaseError[] = [
        ...getOrganizationClientErrors
    ];

    constructor(clientRepo: IClientRepo, organizationStatisticsService: IOrganizationStatisticsService) {
        this.clientRepo = clientRepo;
        this.organizationStatisticsService = organizationStatisticsService;
    }

    public async execute(req: GetOrganizationClientDTO.Request): Promise<GetOrganizationClientDTO.Response> {
        if (!Types.ObjectId.isValid(req.clientId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const clientFound = await this.clientRepo.findById(req.clientId);
        if (clientFound.isFailure) {
            return Result.fail(clientFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding client') : UseCaseError.create('b', 'Client does not exist'))
        }

        const client = await clientFound.getValue()!.populate('contact').execPopulate();

        return Result.ok({client: client});
    }
}