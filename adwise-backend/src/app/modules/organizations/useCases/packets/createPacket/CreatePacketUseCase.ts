import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { PacketModel } from "../../../models/Packet";
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { IPacketValidationService } from "../../../services/packets/packetValidationService/IPacketValidationService";
import { CreatePacketDTO } from "./CreatePacketDTO";
import { createPacketErrors } from "./createPacketErrors";

export class CreatePacketUseCase implements IUseCase<CreatePacketDTO.Request, CreatePacketDTO.Response> {
    private packetRepo: IPacketRepo;
    private packetValidationService: IPacketValidationService;
    public errors: UseCaseError[] = [
        ...createPacketErrors
    ];

    constructor(packetRepo: IPacketRepo, packetValidationService: IPacketValidationService) {
        this.packetRepo = packetRepo;
        this.packetValidationService = packetValidationService;
    }

    public async execute(req: CreatePacketDTO.Request): Promise<CreatePacketDTO.Response> {
        const valid = this.packetValidationService.createPacketData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const packet = new PacketModel({
            name: req.name,
            limit: req.limit,
            price: req.price,
            currency: req.currency,
            managerReward: req.managerReward,
            refBonus: req.refBonus,
            period: req.period,
            wisewinOption: req.wisewinOption
        });

        const packetSaved = await this.packetRepo.save(packet);
        if (packetSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving packet'));
        }

        return Result.ok({packetId: packet._id});
    }
}