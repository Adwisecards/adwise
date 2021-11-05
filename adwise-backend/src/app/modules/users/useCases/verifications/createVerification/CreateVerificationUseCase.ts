import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { ISmsService } from "../../../../../services/smsService/ISmsService";
import { VerificationModel } from "../../../models/Verification";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IVerificationRepo } from "../../../repo/verifications/IVerificationRepo";
import { CreateVerificationDTO } from "./CreateVerificationDTO";
import { createVerificationErrors } from "./createVerificationErrors";

export class CreateVerificationUseCase implements IUseCase<CreateVerificationDTO.Request, CreateVerificationDTO.Response> {
    private verificationRepo: IVerificationRepo;
    private userRepo: IUserRepo;
    private emailService: IEmailService;
    private smsService: ISmsService;
    public errors: UseCaseError[] = [
        ...createVerificationErrors
    ];
    constructor(verificationRepo: IVerificationRepo, userRepo: IUserRepo, emailService: IEmailService, smsService: ISmsService) {
        this.verificationRepo = verificationRepo;
        this.userRepo = userRepo;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    public async execute(req: CreateVerificationDTO.Request): Promise<CreateVerificationDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            if (userFound.getError()!.code == 500) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
            } else {
                return Result.fail(UseCaseError.create('m'));
            }
        }

        const user = userFound.getValue()!;
        if (user.verified) {
            return Result.fail(UseCaseError.create('c'));
        }

        const verificationFound = await this.verificationRepo.findByUser(req.userId);
        if (verificationFound.isSuccess) {
            return Result.fail(UseCaseError.create('f'));
        }

        const verification = new VerificationModel({
            user: user._id,
            password: req.password
        });

        verification.setCode();

        const verificationSaved = await this.verificationRepo.save(verification);
        if (verificationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving verification'));
        }

        if (user.email) {
            const verificationSent = await this.emailService.sendWithPlainText(user.email, 'verification', {code: verification.code}, undefined, user.language as any);
            if (verificationSent.isFailure) {
                await this.verificationRepo.deleteById(verification._id);
                return Result.fail(UseCaseError.create('a', 'Error upon sending verification'));
            }
        } else if (user.phone) {
            const verificationSent = await this.smsService.send(user.phone, 'verification', {
                code: verification.code
            }, user.language as any);
            if (verificationSent.isFailure) {
                await this.verificationRepo.deleteById(verification._id);
                return Result.fail(UseCaseError.create('a', 'Error upon sending verification'));
            }
        }

        return Result.ok({verificationId: verification._id});
    }
};