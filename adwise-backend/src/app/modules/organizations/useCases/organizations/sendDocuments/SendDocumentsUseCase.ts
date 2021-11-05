import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { SendDocumentsDTO } from "./SendDocumentsDTO";
import { sendDocumentsErrors } from "./sendDocumentsErrors";

export class SendDocumentsUseCase implements IUseCase<SendDocumentsDTO.Request, SendDocumentsDTO.Response> {
    private emailService: IEmailService;
    private globalRepo: IGlobalRepo;
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    
    public errors = [
        ...sendDocumentsErrors
    ];

    constructor(emailService: IEmailService, globalRepo: IGlobalRepo, userRepo: IUserRepo, organizationRepo: IOrganizationRepo) {
        this.emailService = emailService;
        this.globalRepo = globalRepo;
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: SendDocumentsDTO.Request): Promise<SendDocumentsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
           return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }
        
        const user = userFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(user.organization.toString());
        if (organizationFound.isFailure) {
           return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }
        
        const organization = organizationFound.getValue()!;

        const emailSent = await this.emailService.sendToMultipleWithPlainText([global.contactEmail, ...global.spareContactEmails], 'document', {
            comment: req.comment,
            name: organization! ? organization!.name : `${user.firstName}${user.lastName ? ' '+user.lastName : ''}`,
            emails: `${user.email || ''}${organization! ? ', '+organization!.emails.join(', ') : ''}`,
            phones: `${user.phone || user.phoneInfo || ''}${organization! ? ', '+organization!.phones.join(', ') : ''}`
        }, req.files);
        if (emailSent.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon sending email'));
        }

        return Result.ok({success: true});
    }
}