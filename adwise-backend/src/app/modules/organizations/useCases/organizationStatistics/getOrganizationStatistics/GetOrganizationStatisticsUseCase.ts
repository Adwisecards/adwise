import { number } from "joi";
import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationStatistics, OrganizationStatisticsModel } from "../../../models/OrganizationStatistics";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationStatisticsRepo } from "../../../repo/organizationStatistics/IOrganizationStatisticsRepo";
import { GetOrganizationStatisticsDTO } from "./GetOrganizationStatisticsDTO";
import { getOrganizationStatisticsErrors } from './getOrganizationStatisticsErrors';

export class GetOrganizationStatisticsUseCase implements IUseCase<GetOrganizationStatisticsDTO.Request, GetOrganizationStatisticsDTO.Response> {
    private organizationStatisticsRepo: IOrganizationStatisticsRepo;
    private organizationRepo: IOrganizationRepo;

    public errors = getOrganizationStatisticsErrors;

    constructor(organizationStatisticsRepo: IOrganizationStatisticsRepo, organizationRepo: IOrganizationRepo) {
        this.organizationStatisticsRepo = organizationStatisticsRepo
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: GetOrganizationStatisticsDTO.Request): Promise<GetOrganizationStatisticsDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId is not valid'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organizaion') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        let organizationStatistics: IOrganizationStatistics;

        const organizationStatisticsFound = await this.organizationStatisticsRepo.findByOrganization(req.organizationId);
        if (organizationStatisticsFound.isFailure && organizationStatisticsFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization statistics'))
        }

        if (organizationStatisticsFound.isFailure && organizationStatisticsFound.getError()!.code == 404) {
            organizationStatistics = new OrganizationStatisticsModel({
                organization: organization._id
            });

            const organizationStatisticsSaved = await this.organizationStatisticsRepo.save(organizationStatistics);
            if (organizationStatisticsSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving organziation statistics'));
            }
        } else {
            organizationStatistics = organizationStatisticsFound.getValue()!;
        }

        return Result.ok({
            organizationStatistics
        });
    }
}