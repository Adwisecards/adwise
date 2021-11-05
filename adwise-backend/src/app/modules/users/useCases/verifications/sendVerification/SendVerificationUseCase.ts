import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { ISmsService } from "../../../../../services/smsService/ISmsService";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IVerificationRepo } from "../../../repo/verifications/IVerificationRepo";
import { SendVerificationDTO } from "./SendVerificationDTO";
import { sendVerificationErrors } from "./sendVerificationErrors";

export class SendVerificationUseCase implements IUseCase<SendVerificationDTO.Request, SendVerificationDTO.Response> {
    private verificationRepo: IVerificationRepo;
    private userRepo: IUserRepo;
    private emailService: IEmailService;
    private smsService: ISmsService;
    public errors = [
        ...sendVerificationErrors
    ];
    constructor(verificationRepo: IVerificationRepo, emailService: IEmailService, smsService: ISmsService, userRepo: IUserRepo) {
        this.verificationRepo = verificationRepo;
        this.emailService = emailService;
        this.smsService = smsService;
        this.userRepo = userRepo;
    }

    public async execute(req: SendVerificationDTO.Request): Promise<SendVerificationDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is invalid'));
        }

        const verificationFound = await this.verificationRepo.findByUser(req.userId);
        if (verificationFound.isFailure) {
            return Result.fail(verificationFound.getError()!.code ? UseCaseError.create('a', 'Error upon finding verification') : UseCaseError.create('b', 'Verification does not exist'));
        }

        const verification = verificationFound.getValue()!;

        if ((new Date().getTime() - verification.sentAt.getTime()) < 120000) {
            return Result.fail(UseCaseError.create('5', 'Cannot send code more often then once in 2 minutes'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('b', 'User does not exist'));
        }

        const user = userFound.getValue()!;

        verification.sentAt = new Date();

        if (user.email) {
            const verificationSent = await this.emailService.sendWithPlainText(user.email, 'verification', {code: verification.code}, undefined, user.language as any);
            if (verificationSent.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon sending verification'));
            }
        } else if (user.phone) {
            const verificationSent = await this.smsService.send(user.phone, 'verification', {
                code: verification.code
            }, user.language as any);
            if (verificationSent.isFailure) {
                console.log(verificationSent.getError());
                return Result.fail(UseCaseError.create('a', 'Error upon sending verification'));
            }
        }

        await this.verificationRepo.save(verification);

        return Result.ok({verificationId: verification._id});
    }
}