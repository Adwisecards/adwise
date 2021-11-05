import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { GetWisewinOptionPacketsDTO } from "./GetWisewinOptionPacketsDTO";
import { getWisewinOptionPacketsErrors } from "./getWisewinOptionPacketsErrors";

export class GetWisewinOptionPacketsUseCase implements IUseCase<GetWisewinOptionPacketsDTO.Request, GetWisewinOptionPacketsDTO.Response> {
    private packetRepo: IPacketRepo;

    public errors = getWisewinOptionPacketsErrors;

    constructor(packetRepo: IPacketRepo) {
        this.packetRepo = packetRepo;
    }

    public async execute(_: GetWisewinOptionPacketsDTO.Request): Promise<GetWisewinOptionPacketsDTO.Response> {
        const packetsFound = await this.packetRepo.findManyByWisewinOption(true);
        if (packetsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding wisewin option packets'));
        }

        const packets = packetsFound.getValue()!;

        return Result.ok({packets});
    }
}