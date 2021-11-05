import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganization } from "../../../models/Organization";
import { IPacket } from "../../../models/Packet";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { SendEnrollmentRequestDTO } from "./SendEnrollmentRequestDTO";
import { sendEnrollmentRequestErrors } from "./sendEnrollmentRequestErrors";

export interface IKeyObjects {
    user: IUser;
    organization: IOrganization;
    global: IGlobal;
    packet: IPacket;
};

export class SendEnrollmentRequestUseCase implements IUseCase<SendEnrollmentRequestDTO.Request, SendEnrollmentRequestDTO.Response> {
    private userRepo: IUserRepo;
    private globalRepo: IGlobalRepo;
    private packetRepo: IPacketRepo;
    private emailService: IEmailService;
    private organizationRepo: IOrganizationRepo;
    private organizationValidationService: IOrganizationValidationService;

    public errors = sendEnrollmentRequestErrors;

    constructor(
        userRepo: IUserRepo,
        globalRepo: IGlobalRepo,
        packetRepo: IPacketRepo,
        emailService: IEmailService,
        organizationRepo: IOrganizationRepo,
        organizationValidationService: IOrganizationValidationService
    ) {
        this.userRepo = userRepo;
        this.globalRepo = globalRepo;
        this.packetRepo = packetRepo;
        this.emailService = emailService;
        this.organizationRepo = organizationRepo;
        this.organizationValidationService = organizationValidationService;
    }

    public async execute(req: SendEnrollmentRequestDTO.Request): Promise<SendEnrollmentRequestDTO.Response> {
        const valid = this.organizationValidationService.sendEnrollmentRequestData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.packetId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            global,
            organization,
            packet,
            user
        } = keyObjectsGotten.getValue()!;

        organization.requestedPacket = packet;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        const emailSent = await this.emailService.sendToMultipleWithPlainText([global.contactEmail, ...global.spareContactEmails], 'enrollmentRequest', {
            comment: req.comment,
            name: organization! ? organization!.name : `${user.firstName}${user.lastName ? ' '+user.lastName : ''}`,
            emails: req.email || `${user.email || ''}${organization! ? ', '+organization!.emails.join(', ') : ''}`,
            phones: `${user.phone || user.phoneInfo || ''}${organization! ? ', '+organization!.phones.join(', ') : ''}`,
            packet: packet.name,
            manager: req.managerNeeded ? 'Нужен' : 'Не нужен'
        }, req.files);
        if (emailSent.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon sending email'));
        }

        return Result.ok({success: true});
    }

    private async getKeyObjects(userId: string, packetId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        } 

        const user = userFound.getValue()!;

        if (!user.organization) {
            return Result.fail(UseCaseError.create('c', 'User has no organization'));
        }

        const organizationFound = await this.organizationRepo.findById(user.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const packetFound = await this.packetRepo.findById(packetId);
        if (packetFound.isFailure) {
            return Result.fail(packetFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding packet') : UseCaseError.create('y'));
        }

        const packet = packetFound.getValue()!;

        return Result.ok({
            global,
            organization,
            packet,
            user
        });
    }
}