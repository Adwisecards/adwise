import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { ISmsService } from "../../../../../services/smsService/ISmsService";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IVerificationRepo } from "../../../repo/verifications/IVerificationRepo";
import { DeleteVerificationDTO } from "./DeleteVerificationDTO";
import { deleteVerificationErrors } from "./deleteVerificationErrors";

export class DeleteVerificationUseCase implements IUseCase<DeleteVerificationDTO.Request, DeleteVerificationDTO.Response> {
    private userRepo: IUserRepo;
    private verificationRepo: IVerificationRepo;
    private emailService: IEmailService;
    private smsService: ISmsService;
    public errors: UseCaseError[] = [
        ...deleteVerificationErrors
    ];
    constructor(userRepo: IUserRepo, verificationRepo: IVerificationRepo, emailService: IEmailService, smsService: ISmsService) {
        this.userRepo = userRepo;
        this.verificationRepo = verificationRepo;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    public async execute(req: DeleteVerificationDTO.Request): Promise<DeleteVerificationDTO.Response> {
        if (!Types.ObjectId.isValid(req.verificationId) || req.code.length != 4) {
            return Result.fail(UseCaseError.create('c'));
        }

        const verificationFound = await this.verificationRepo.findById(req.verificationId);
        if (verificationFound.isFailure) {
            return Result.fail(verificationFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const verification = verificationFound.getValue()!;
        if (req.code != verification.code) {
            return Result.fail(UseCaseError.create('i'));
        }

        const userFound = await this.userRepo.findById(verification.user.toHexString());
        if (userFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
        }
        
        const user = userFound.getValue()!;
        user.verified = true;

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        if (user.email) {
            const verificationSent = await this.emailService.sendWithPlainText(user.email, 'password', {password: verification.password}, undefined, user.language as any);
            if (verificationSent.isFailure) {
                await this.userRepo.deleteById(user._id);
                return Result.fail(UseCaseError.create('a', 'Error upon sending verification'));
            }
        } else if (user.phone) {
            const userSent = await this.smsService.send(user.phone, 'password', {
                password: verification.password
            }, user.language as any);
            if (userSent.isFailure) {
                await this.userRepo.deleteById(user._id);
                return Result.fail(UseCaseError.create('a', 'Error upon sending verification'));
            }
        }

        await this.verificationRepo.deleteById(req.verificationId);

        return Result.ok({verificationId: req.verificationId});
    }    
}