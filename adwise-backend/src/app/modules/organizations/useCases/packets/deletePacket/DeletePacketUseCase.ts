import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { DeletePacketDTO } from "./DeletePacketDTO";
import { deletePacketErrors } from "./deletePacketErrors";

export class DeletePacketUseCase implements IUseCase<DeletePacketDTO.Request, DeletePacketDTO.Response> {
    private packetRepo: IPacketRepo;
    public errors: UseCaseError[] = [
        ...deletePacketErrors
    ];

    constructor(packetRepo: IPacketRepo) {
        this.packetRepo = packetRepo;
    }

    public async execute(req: DeletePacketDTO.Request): Promise<DeletePacketDTO.Response> {
        if (!Types.ObjectId.isValid(req.packetId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const packetFound = await this.packetRepo.findById(req.packetId);
        if (packetFound.isFailure) {
            return Result.fail(packetFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding packet') : UseCaseError.create('b', 'Error upon saving'));
        }

        const packetDeleted = await this.packetRepo.deleteById(req.packetId);
        if (packetDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting packet'));
        }

        return Result.ok({packetId: req.packetId});
    }
}