import { Types } from "mongoose";
import MyRegexp from "myregexp";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { ILegalRepo } from "../../../../legal/repo/legal/ILegalRepo";
import { GenerateOrganizationDocumentUseCase } from "../../../../legal/useCases/organizationDocuments/generateOrganizationDocument/GenerateOrganizationDocumentUseCase";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IPacketRepo } from "../../../repo/packets/IPacketRepo";
import { IPacketValidationService } from "../../../services/packets/packetValidationService/IPacketValidationService";
import { RequestPacketDTO } from "./RequestPacketDTO";
import { requestPacketErrors } from "./requestPacketErrors";

export class RequestPacketUseCase implements IUseCase<RequestPacketDTO.Request, RequestPacketDTO.Response> {
    private globalRepo: IGlobalRepo;
    private packetRepo: IPacketRepo;
    private organizationRepo: IOrganizationRepo;
    private userRepo: IUserRepo;
    private emailService: IEmailService;
    private generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase;
    private legalRepo: ILegalRepo;
    private packetValidationService: IPacketValidationService;

    public errors = requestPacketErrors;

    constructor(
        globalRepo: IGlobalRepo, 
        emailService: IEmailService, 
        packetRepo: IPacketRepo, 
        organizationRepo: IOrganizationRepo, 
        userRepo: IUserRepo,
        generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase,
        legalRepo: ILegalRepo,
        packetValidationService: IPacketValidationService
    ) {
        this.globalRepo = globalRepo;
        this.emailService = emailService;
        this.packetRepo = packetRepo;
        this.organizationRepo = organizationRepo;
        this.userRepo = userRepo;
        this.generateOrganizationDocumentUseCase = generateOrganizationDocumentUseCase;
        this.legalRepo = legalRepo;
        this.packetValidationService = packetValidationService;
    }

    public async execute(req: RequestPacketDTO.Request): Promise<RequestPacketDTO.Response> {
        if (!MyRegexp.email().test(req.email) || !Types.ObjectId.isValid(req.packetId) || !Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'either email or packetId or userId are not valid'));
        }

        const globalGotten = await this.globalRepo.getGlobal()!;
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;
        
        const organizationFound = await this.organizationRepo.findById(user.organization.toHexString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const legalFound = await this.legalRepo.findByOrganizationAndRelevant(organization._id.toString(), true);
        if (legalFound.isFailure) {
            return Result.fail(legalFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding legal') : UseCaseError.create('b4'));
        }

        const legal = legalFound.getValue()!;

        const packetFound = await this.packetRepo.findById(req.packetId);
        if (packetFound.isFailure) {
            return Result.fail(packetFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding packet') : UseCaseError.create('y'));
        }

        const packet = packetFound.getValue()!;

        organization.requestedPacket = packet;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        if (legal && req.generateDocuments) {
            await this.generateOrganizationDocumentUseCase.execute({
                organizationId: organization._id.toString(),
                type: 'treaty',
                userId: organization.user.toString()
            });
            await this.generateOrganizationDocumentUseCase.execute({
                organizationId: organization._id.toString(),
                type: 'application',
                userId: organization.user.toString()
            });
        }

        const emailSent = await this.emailService.sendToMultipleWithPlainText([global.contactEmail, ...global.spareContactEmails], 'packetRequest', {
            organizationName: organization.name,
            packetName: packet.name,
            packetPrice: packet.price,
            email: req.email
        });
        if (emailSent.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon sending email'));
        }

        return Result.ok({
            packetId: req.packetId
        });
    }
}