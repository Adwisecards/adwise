import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPacket } from "../../../models/Packet";
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { SetPacketDefaultDTO } from "./SetPacketDefaultDTO";
import { setPacketDefaultErrors } from "./setPacketDefaultErrors";

export class SetPacketDefaultUseCase implements IUseCase<SetPacketDefaultDTO.Request, SetPacketDefaultDTO.Response> {
    private packetRepo: IPacketRepo;

    public errors = [
        ...setPacketDefaultErrors
    ];

    constructor(packetRepo: IPacketRepo) {
        this.packetRepo = packetRepo;
    }

    public async execute(req: SetPacketDefaultDTO.Request): Promise<SetPacketDefaultDTO.Response> {
        if (!Types.ObjectId.isValid(req.packetId)) {
            return Result.fail(UseCaseError.create('c', 'packetId is not valid'));
        }

        let packetDefault: IPacket;

        const packetDefaultFound = await this.packetRepo.findWiseDefault();
        if (packetDefaultFound.isSuccess) {
            packetDefault = packetDefaultFound.getValue()!;
        }

        const packetFound = await this.packetRepo.findById(req.packetId);
        if (packetFound.isFailure) {
            return Result.fail(packetFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding packet') : UseCaseError.create('y'));
        }

        const packet = packetFound.getValue()!;

        // packet.wiseDefault = true;

        // if (packetDefault!) {
        //     packetDefault!.wiseDefault = false;
        //     const packetDefaultSaved = await this.packetRepo.save(packetDefault!);
        //     if (packetDefaultSaved.isFailure) {
        //         return Result.fail(UseCaseError.create('a', 'Error upon saving packet'));
        //     }
        // }

        const packetSaved = await this.packetRepo.save(packet);
        if (packetSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving packet'));
        }

        return Result.ok({packetId: req.packetId});
    }
}