import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { PacketSoldRecordModel } from "../../../models/PacketSoldRecord";
import { IPacketSoldRecordRepo } from "../../../repo/packetSoldRecords/IPacketSoldRecordRepo";
import { CreatePacketSoldRecordDTO } from "./CreatePacketSoldRecordDTO";
import { createPacketSoldRecordErrors } from "./createPacketSoldRecordErrors";

export class CreatePacketSoldRecordUseCase implements IUseCase<CreatePacketSoldRecordDTO.Request, CreatePacketSoldRecordDTO.Response> {
    private packetSoldRecordRepo: IPacketSoldRecordRepo;
    
    public errors = [
        ...createPacketSoldRecordErrors
    ];

    constructor(packetSoldRecordRepo: IPacketSoldRecordRepo) {
        this.packetSoldRecordRepo = packetSoldRecordRepo;
    }

    public async execute(req: CreatePacketSoldRecordDTO.Request): Promise<CreatePacketSoldRecordDTO.Response> {
        const packetSoldRecord = new PacketSoldRecordModel({
            organization: req.organization,
            manager: req.manager,
            packet: req.packet,
            timestamp: req.date,
            reason: req.reason
        });


        const packetSoldRecordSaved = await this.packetSoldRecordRepo.save(packetSoldRecord);
        if (packetSoldRecordSaved.isFailure) {
            console.log(packetSoldRecordSaved);
            return Result.fail(UseCaseError.create('a', 'Error upon saving packet sold record'));
        }

        return Result.ok({
            packetSoldRecordId: packetSoldRecord._id
        });
    }
}