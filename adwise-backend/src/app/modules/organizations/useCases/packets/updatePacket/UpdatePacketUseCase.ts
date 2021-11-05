import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { IPacketValidationService } from "../../../services/packets/packetValidationService/IPacketValidationService";
import { UpdatePacketDTO } from "./UpdatePacketDTO";
import { updatePacketErrors } from "./updatePacketErrors";

export class UpdatePacketUseCase implements IUseCase<UpdatePacketDTO.Request, UpdatePacketDTO.Response> {
    private packetRepo: IPacketRepo;
    private packetValidationService: IPacketValidationService;

    public errors = updatePacketErrors;

    constructor(
        packetRepo: IPacketRepo,
        packetValidationService: IPacketValidationService
    ) {
        this.packetRepo = packetRepo;
        this.packetValidationService = packetValidationService;
    }

    public async execute(req: UpdatePacketDTO.Request): Promise<UpdatePacketDTO.Response> {
        const valid = this.packetValidationService.updatePacketData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const packetFound = await this.packetRepo.findById(req.packetId);
        if (packetFound.isFailure) {
            return Result.fail(packetFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding packet') : UseCaseError.create('y'));
        }

        const packet = packetFound.getValue()!;

        for (const key in req) {
            (<any>packet)[key] = (<any>req)[key];
        }

        const packetSaved = await this.packetRepo.save(packet);
        if (packetSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving packet'));
        }

        return Result.ok({packetId: req.packetId});
    }
}