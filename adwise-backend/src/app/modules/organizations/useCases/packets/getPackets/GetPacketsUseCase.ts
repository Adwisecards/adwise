import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { GetPacketsDTO } from "./GetPacketsDTO";
import { getPacketsErrors } from "./getPacketsErrors";

export class GetPacketsUseCase implements IUseCase<GetPacketsDTO.Request, GetPacketsDTO.Response> {
    private packetRepo: IPacketRepo;
    public errors: UseCaseError[] = [
        ...getPacketsErrors
    ];
    constructor(packetRepo: IPacketRepo) {
        this.packetRepo = packetRepo;
    }

    public async execute(req: GetPacketsDTO.Request): Promise<GetPacketsDTO.Response> {
        const packetsFound = await this.packetRepo.findAll(req.all);
        if (packetsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding packets'));
        }

        const packets = packetsFound.getValue()!;

        return Result.ok({packets});
    }
}