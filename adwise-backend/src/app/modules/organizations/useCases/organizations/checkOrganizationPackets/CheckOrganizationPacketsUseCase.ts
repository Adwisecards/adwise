import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";

export class CheckOrganizationPacketsUseCase implements IUseCase<any, any> {
    private organizationRepo: IOrganizationRepo;
    public errors = [];

    constructor(organizationRepo: IOrganizationRepo) {
        this.organizationRepo = organizationRepo;
    }

    public async execute(_: any): Promise<any> {
        const organizationsFound = await this.organizationRepo.getAll();
        if (organizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
        }

        const organizations = organizationsFound.getValue()!.filter(o => !!o.packet);
        for (const organization of organizations) {
            const date = new Date();
            
            const packetTimestamp = organization.packet.timestamp;

            packetTimestamp.setMonth(packetTimestamp.getMonth() + organization.packet.period);

            if (packetTimestamp.getTime() > date.getTime()) continue;

            organization.packet = undefined as any;
            await this.organizationRepo.save(organization);
        }

        return Result.ok({});
    }
}