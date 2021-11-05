import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { IOrganization } from "../../../../app/modules/organizations/models/Organization";
import { IPacket } from "../../../../app/modules/organizations/models/Packet";
import { IOrganizationRepo } from "../../../../app/modules/organizations/repo/organizations/IOrganizationRepo";
import { SetOrganizationPacketUseCase } from "../../../../app/modules/organizations/useCases/packets/setOrganizationPacket/SetOrganizationPacketUseCase";

interface ISetOrganizationPacketObjects {
    organization: IOrganization;
};

export class SetOrganizationPacketTest {
    private organizationRepo: IOrganizationRepo;
    private setOrganizationPacketUseCase: SetOrganizationPacketUseCase;

    constructor(
        organizationRepo: IOrganizationRepo,
        setOrganizationPacketUseCase: SetOrganizationPacketUseCase
    ) {
        this.organizationRepo = organizationRepo;
        this.setOrganizationPacketUseCase = setOrganizationPacketUseCase;
    }

    public async setOrganizationPacketTest(organization: IOrganization, packet: IPacket): Promise<Result<ISetOrganizationPacketObjects | null, UseCaseError | null>> {
        const organizationPacketSet = await this.setOrganizationPacketUseCase.execute({
            date: new Date().toISOString(),
            noRecord: false,
            organizationId: organization._id.toString(),
            packetId: packet._id.toString(),
            asWisewinOption: false,
            reason: 'FO DA TEST'
        });

        if (organizationPacketSet.isFailure) {
            return Result.fail(organizationPacketSet.getError());
        }

        const organizationFound = await this.organizationRepo.findById(organization._id.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        organization = organizationFound.getValue()!;

        if (!organization.packet) {
            return Result.fail(UseCaseError.create('c', 'Organization has no packet'));
        }

        return Result.ok({organization});
    }
}