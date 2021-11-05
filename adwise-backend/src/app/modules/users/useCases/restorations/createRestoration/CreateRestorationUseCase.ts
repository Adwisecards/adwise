import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { ISmsService } from "../../../../../services/smsService/ISmsService";
import { RestorationModel } from "../../../models/Restoration";
import { IUser } from "../../../models/User";
import { IRestorationRepo } from "../../../repo/restorations/IRestorationRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IUserValidationService } from "../../../services/userValidationService/IUserValidationService";
import { CreateRestorationDTO } from "./CreateRestorationDTO";
import { createRestorationErrors } from "./createRestorationErrors";

export class CreateRestorationUseCase implements IUseCase<CreateRestorationDTO.Request, CreateRestorationDTO.Response> {
    private restorationRepo: IRestorationRepo;
    private userRepo: IUserRepo;
    private userValidationService: IUserValidationService;
    private emailService: IEmailService;
    private smsService: ISmsService;
    public errors: UseCaseError[] = [
        ...createRestorationErrors
    ]
    constructor(restorationRepo: IRestorationRepo, userRepo: IUserRepo, userValidationService: IUserValidationService, emailService: IEmailService, smsService: ISmsService) {
        this.restorationRepo = restorationRepo;
        this.userRepo = userRepo;
        this.userValidationService = userValidationService;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    public async execute(req: CreateRestorationDTO.Request): Promise<CreateRestorationDTO.Response> {
        const valid = this.userValidationService.restorePasswordData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        let user: IUser;
        if (req.phone) {
            const userFound = await this.userRepo.findByPhone(req.phone);
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
            } else {
                user = userFound.getValue()!
            }
        } else if (req.email) {
            const userFound = await this.userRepo.findByEmail(req.email);
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
            } else {
                user = userFound.getValue()!
            }
        }

        const restoration = new RestorationModel({
            user: user!._id
        });
        restoration.setCode();

        const restorationSaved = await this.restorationRepo.save(restoration);
        if (restorationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving restoration'));
        }

        if (user!.phone) {
            const restorationSent = await this.smsService.send(user!.phone, 'restoration', {
                code: restoration.code
            }, user!.language as any);
            if (restorationSent.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon sending restoration'));
            }
        } else if (user!.email) {
            const verificationSent = await this.emailService.sendWithPlainText(user!.email, 'restoration', {code: restoration.code}, undefined, user!.language as any);
            if (verificationSent.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon sending restoration'));
            }
        }

        return Result.ok({
            restorationId: restoration._id
        });
    }
}