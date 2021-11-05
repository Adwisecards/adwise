import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { IPacketValidationService } from "../../../services/packets/packetValidationService/IPacketValidationService";
import { GenerateDocumentsUseCase } from "../../organizations/generateDocuments/GenerateDocumentsUseCase";
import { AddPacketToOrganizationUseCase } from "../addPacketToOrganization/AddPacketToOrganizationUseCase";
import { SetOrganizationPacketDTO } from "./SetOrganizationPacketDTO";
import { setOrganizationPacketErrors } from "./setOrganizationPacketErrors";

export class SetOrganizationPacketUseCase implements IUseCase<SetOrganizationPacketDTO.Request, SetOrganizationPacketDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private packetRepo: IPacketRepo;
    private addPacketToOrganizationUseCase: AddPacketToOrganizationUseCase;
    private packetValidationService: IPacketValidationService;
    private generateDocumentsUseCase: GenerateDocumentsUseCase;

    public errors = [
        ...setOrganizationPacketErrors
    ];

    constructor(
        organizationRepo: IOrganizationRepo, 
        packetRepo: IPacketRepo, 
        addPacketToOrganizationUseCase: AddPacketToOrganizationUseCase, 
        packetValidationService: IPacketValidationService,
        generateDocumentsUseCase: GenerateDocumentsUseCase
    ) {
        this.organizationRepo = organizationRepo;
        this.packetRepo = packetRepo;
        this.addPacketToOrganizationUseCase = addPacketToOrganizationUseCase;
        this.packetValidationService = packetValidationService;
        this.generateDocumentsUseCase = generateDocumentsUseCase;
    }

    public async execute(req: SetOrganizationPacketDTO.Request): Promise<SetOrganizationPacketDTO.Response> {
        const valid = this.packetValidationService.setPacketData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        // if (!organization.manager) {
        //     return Result.fail(UseCaseError.create('c', 'Manager is not appointed'));
        // }

        const packetFound = await this.packetRepo.findById(req.packetId);
        if (packetFound.isFailure) {
            return Result.fail(packetFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding packet') : UseCaseError.create('y'));
        }

        const packet = packetFound.getValue()!;

        if (packet.disabled) {
            return Result.fail(UseCaseError.create('c', 'Packet is disabled'));
        }

        packet.timestamp = req.date as any || new Date();

        if (req.asWisewinOption) {
            packet.asWisewinOption = true;
        }

        organization.packet = packet;

        organization.requestedPacket = undefined as any;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        if (!req.noRecord) {
            await this.addPacketToOrganizationUseCase.execute({
                default: false,
                organizationId: organization._id,
                packetId: packet._id,
                date: req.date,
                reason: req.reason
            });
        }

        return Result.ok({organizationId: req.organizationId});
    }
}