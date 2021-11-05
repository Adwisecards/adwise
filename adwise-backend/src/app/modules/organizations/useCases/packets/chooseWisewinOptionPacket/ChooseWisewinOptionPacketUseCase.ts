import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganization } from "../../../models/Organization";
import { IPacket } from "../../../models/Packet";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { IPacketValidationService } from "../../../services/packets/packetValidationService/IPacketValidationService";
import { GenerateDocumentsUseCase } from "../../organizations/generateDocuments/GenerateDocumentsUseCase";
import { SetOrganizationPacketUseCase } from "../setOrganizationPacket/SetOrganizationPacketUseCase";
import { ChooseWisewinOptionPacketDTO } from "./ChooseWisewinOptionPacketDTO";
import { chooseWisewinOptionPacketErrors } from "./chooseWisewinOptionPacketErrors";

interface IKeyObjects {
    user: IUser;
    organization?: IOrganization;
    packet: IPacket;
};

export class ChooseWisewinOptionPacketUseCase implements IUseCase<ChooseWisewinOptionPacketDTO.Request, ChooseWisewinOptionPacketDTO.Response> {
    private userRepo: IUserRepo;
    private packetRepo: IPacketRepo;
    private organizationRepo: IOrganizationRepo;
    private packetValidationService: IPacketValidationService;
    private generateDocumentsUseCase: GenerateDocumentsUseCase;
    private setOrganizationPacketUseCase: SetOrganizationPacketUseCase;

    public errors = chooseWisewinOptionPacketErrors;

    constructor(
        userRepo: IUserRepo,
        packetRepo: IPacketRepo,
        organizationRepo: IOrganizationRepo,
        packetValidationService: IPacketValidationService,
        generateDocumentsUseCase: GenerateDocumentsUseCase,
        setOrganizationPacketUseCase: SetOrganizationPacketUseCase
    ) {
        this.userRepo = userRepo;
        this.packetRepo = packetRepo;
        this.organizationRepo = organizationRepo;
        this.packetValidationService = packetValidationService;
        this.generateDocumentsUseCase = generateDocumentsUseCase;
        this.setOrganizationPacketUseCase = setOrganizationPacketUseCase; 
    }

    public async execute(req: ChooseWisewinOptionPacketDTO.Request): Promise<ChooseWisewinOptionPacketDTO.Response> {
        const valid = this.packetValidationService.chooseWisewinOptionPacketData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.packetId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            packet,
            user,
            organization
        } = keyObjectsGotten.getValue()!;

        if (!user.wisewinId) {
            return Result.fail(UseCaseError.create('d', 'User is not wisewin manager'));
        }

        if (!organization) {
            return Result.fail(UseCaseError.create('c', 'User have no organization'));
        }

        if (!packet.wisewinOption) {
            return Result.fail(UseCaseError.create('c', 'Packet is not wisewin option'));
        }

        const packetAddedToOrganization = await this.setOrganizationPacketUseCase.execute({
            date: new Date().toISOString(),
            organizationId: organization._id.toString(),
            packetId: req.packetId,
            noRecord: false,
            asWisewinOption: true
        });

        if (packetAddedToOrganization.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon adding packet to organization'));
        }

        return Result.ok({packetId: req.packetId});
    }

    private async getKeyObjects(userId: string, packetId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const packetFound = await this.packetRepo.findById(packetId);
        if (packetFound.isFailure) {
            return Result.fail(packetFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding packet') : UseCaseError.create('y'));
        }

        const packet = packetFound.getValue()!;
        
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        let organization: IOrganization | undefined

        if (user.organization) {
            const organizationFound = await this.organizationRepo.findById(user.organization.toString());
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
            }

            organization = organizationFound.getValue()!;
        }

        return Result.ok({
            organization,
            packet,
            user
        });
    }
}