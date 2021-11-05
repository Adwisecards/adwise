import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { DisablePacketDTO } from "./DisablePacketDTO";
import { disablePacketErrors } from "./disablePacketErrors";

export class DisablePacketUseCase implements IUseCase<DisablePacketDTO.Request, DisablePacketDTO.Response> {
    private packetRepo: IPacketRepo;

    public errors = [
        ...disablePacketErrors
    ];

    constructor(packetRepo: IPacketRepo) {
        this.packetRepo = packetRepo;
    }

    public async execute(req: DisablePacketDTO.Request): Promise<DisablePacketDTO.Response> {
        if (typeof req.disabled != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'disabled is not valid'));
        }

        if (!Types.ObjectId.isValid(req.packetId)) {
            return Result.fail(UseCaseError.create('c', 'packetId is not valid'));
        }

        const packetFound = await this.packetRepo.findById(req.packetId);
        if (packetFound.isFailure) {
            return Result.fail(packetFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding packet') : UseCaseError.create('y'));
        }

        const packet = packetFound.getValue()!;

        packet.disabled = req.disabled;

        const packetSaved = await this.packetRepo.save(packet);
        if (packetSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving packet'));
        }

        return Result.ok({packetId: req.packetId});
    }
}