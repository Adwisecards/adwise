import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { ISmsService } from "../../../../../services/smsService/ISmsService";
import { IRestorationRepo } from "../../../repo/restorations/IRestorationRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IAuthService } from "../../../services/authService/IAuthService";
import { IPasswordService } from "../../../services/passwordService/IPasswordService";
import { ConfirmRestorationDTO } from "./ConfirmRestorationDTO";
import { confirmRestorationErrors } from "./confirmRestorationErrors";

export class ConfirmRestorationUseCase implements IUseCase<ConfirmRestorationDTO.Request, ConfirmRestorationDTO.Response> {
    private restorationRepo: IRestorationRepo;
    private emailService: IEmailService;
    private smsService: ISmsService;
    private userRepo: IUserRepo;
    private passwordService: IPasswordService;
    private authService: IAuthService;

    public errors = confirmRestorationErrors;

    constructor(
        restorationRepo: IRestorationRepo, 
        emailService: IEmailService, 
        smsService: ISmsService, 
        userRepo: IUserRepo, 
        passwordService: IPasswordService,
        authService: IAuthService
    ) {
        this.restorationRepo = restorationRepo;
        this.emailService = emailService;
        this.userRepo = userRepo;
        this.passwordService = passwordService;
        this.smsService = smsService;
        this.authService = authService;
    }

    public async execute(req: ConfirmRestorationDTO.Request): Promise<ConfirmRestorationDTO.Response> {
        if (!Types.ObjectId.isValid(req.restorationId) || !req.code || req.code.length != 4) {
            return Result.fail(UseCaseError.create('c'));
        }

        const restorationFound = await this.restorationRepo.findById(req.restorationId);
        if (restorationFound.isFailure) {
            return Result.fail(restorationFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const restoration = restorationFound.getValue()!;
        if (restoration.code != req.code) {
            return Result.fail(UseCaseError.create('i'));
        }

        restoration.confirmed = true;

        const userFound = await this.userRepo.findById(restoration.user.toHexString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;
        
        const password = this.passwordService.generatePassword();
        user.password = password;

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
        }

        if (user.phone) {
            const restorationSent = await this.smsService.send(user.phone, 'password', {
                password: password
            }, user.language as any);
            if (restorationSent.isFailure) {
                await this.restorationRepo.deleteById(restoration._id);
                return Result.fail(UseCaseError.create('a', 'Error upon sending restoration'));
            }
        } else if (user.email) {
            const restorationSent = await this.emailService.sendWithPlainText(user.email, 'password', {password: password}, undefined, user.language as any);
            if (restorationSent.isFailure) {
                await this.restorationRepo.deleteById(restoration._id);
                return Result.fail(UseCaseError.create('a', 'Error upon saving restoration'));
            }
        }
        
        const restorationDeleted = await this.restorationRepo.deleteById(restoration._id);
        if (restorationDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting restoration'));
        }

        const jwtGenerated = await this.authService.sign({
            admin: user.admin,
            adminGuest: user.adminGuest,
            userId: user._id.toString()
        });

        if (jwtGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating jwt'));
        }

        const jwt = jwtGenerated.getValue()!;

        return Result.ok({restorationId: req.restorationId, jwt});
    }
}