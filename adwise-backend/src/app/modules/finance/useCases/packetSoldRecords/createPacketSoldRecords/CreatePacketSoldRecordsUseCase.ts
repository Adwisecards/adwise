import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { PacketSoldRecordModel } from "../../../models/PacketSoldRecord";
import { CreatePacketSoldRecordUseCase } from "../createPacketSoldRecord/CreatePacketSoldRecordUseCase";
import { CreatePacketSoldRecordsDTO } from "./CreatePacketSoldRecordsDTO";
import { createPacketSoldRecordsErrors } from "./createPacketSoldRecordsErrors";

export class CreatePacketSoldRecordsUseCase implements IUseCase<CreatePacketSoldRecordsDTO.Request, CreatePacketSoldRecordsDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private createPacketSoldRecord: CreatePacketSoldRecordUseCase;
    private userRepo: IUserRepo;

    public errors = [
        ...createPacketSoldRecordsErrors
    ];

    constructor(organizationRepo: IOrganizationRepo, createPacketSoldRecordUseCase: CreatePacketSoldRecordUseCase, userRepo: IUserRepo) {
        this.organizationRepo = organizationRepo;
        this.createPacketSoldRecord = createPacketSoldRecordUseCase;
        this.userRepo = userRepo;
    }

    public async execute(_: CreatePacketSoldRecordsDTO.Request): Promise<CreatePacketSoldRecordsDTO.Response> {
        const organizationsFound = await this.organizationRepo.getAll();
        if (organizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
        }

        const organizations = organizationsFound.getValue()!;

        const packetSoldRecordIds = [];
        
        for (const organization of organizations) {
            if (!organization.packet) continue;
            console.log(organization._id);

            const packet = organization.packet;

            let manager: IUser | undefined;
            
            const managerFound = await this.userRepo.findById(organization.manager.toString());
            if (managerFound.isSuccess) {   
                manager = managerFound.getValue()!;
            }

            const packetSoldRecordCreated = await this.createPacketSoldRecord.execute({
                manager: manager,
                packet: packet,
                organization: organization,
                date: packet.timestamp
            });

            if (packetSoldRecordCreated.isSuccess) {
                packetSoldRecordIds.push(packetSoldRecordCreated.getValue()!.packetSoldRecordId)
            }
        }

        return Result.ok({packetSoldRecordIds: packetSoldRecordIds});
    }
}