import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { GetOrganizationCitiesDTO } from "./GetOrganizationCitiesDTO";
import { getOrganizationCitiesErrors } from "./getOrganizationCitiesErrors";

export class GetOrganizationCitiesUseCase implements IUseCase<GetOrganizationCitiesDTO.Request, GetOrganizationCitiesDTO.Response> {
    private organizationRepo: IOrganizationRepo;

    public errors = getOrganizationCitiesErrors;

    constructor(organizationRepo: IOrganizationRepo) {
        this.organizationRepo = organizationRepo;
    }

    public async execute(_: GetOrganizationCitiesDTO.Request): Promise<GetOrganizationCitiesDTO.Response> {
        const organizationsGotten = await this.organizationRepo.getAll();
        if (organizationsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting organizations'));
        }

        const organizations = organizationsGotten.getValue()!;

        const cityMap: {[key: string]: boolean} = {};

        for (const organization of organizations) {
            if (cityMap[organization.address.city]) continue;

            cityMap[organization.address.city] = true;
        }

        const cities = Object.keys(cityMap);

        return Result.ok({organizationCities: cities});
    }
}