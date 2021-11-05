import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { ISmsService } from "../../../../../services/smsService/ISmsService";
import { IRestorationRepo } from "../../../repo/restorations/IRestorationRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { SendRestorationCodeDTO } from "./SendRestorationCodeDTO";
import { sendRestorationCodeErrors } from "./sendRestorationCodeErrors";

export class SendRestorationCodeUseCase implements IUseCase<SendRestorationCodeDTO.Request, SendRestorationCodeDTO.Response> {
    private restorationRepo: IRestorationRepo;
    private emailService: IEmailService;
    private smsService: ISmsService;
    private userRepo: IUserRepo;

    public errors = sendRestorationCodeErrors;

    constructor(restorationRepo: IRestorationRepo, emailService: IEmailService, smsService: ISmsService, userRepo: IUserRepo) {
        this.restorationRepo= restorationRepo;
        this.emailService = emailService;
        this.smsService = smsService;
        this.userRepo = userRepo;
    }

    public async execute(req: SendRestorationCodeDTO.Request): Promise<SendRestorationCodeDTO.Response> {
        if (!Types.ObjectId.isValid(req.restorationId)) {
            return Result.fail(UseCaseError.create('c', 'restorationId is not valid'));
        }

        const restorationFound = await this.restorationRepo.findById(req.restorationId);
        if (restorationFound.isFailure) {
            return Result.fail(restorationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding restoration') : UseCaseError.create('b', 'Restoration does not exist'));
        }

        const restoration = restorationFound.getValue()!;

        if ((new Date().getTime() - restoration.sentAt.getTime()) < 120000) {
            return Result.fail(UseCaseError.create('5', 'Cannot send code more often then once in 2 minutes'));
        }

        if (restoration.confirmed) {
            return Result.fail(UseCaseError.create('c', 'Restoration is already confirmed'));
        }

        restoration.sentAt = new Date();

        const userFound = await this.userRepo.findById(restoration.user.toString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'))
        }

        const user = userFound.getValue()!;

        if (user!.phone) {
            const restorationSent = await this.smsService.send(user!.phone, 'restoration', {
                restorationCode: restoration.code
            }, user.language as any);
            if (restorationSent.isFailure) {
                console.log(restorationSent.getError())
                return Result.fail(UseCaseError.create('a', 'Error upon sending restoration'));
            }
        } else if (user!.email) {
            const restorationSent = await this.emailService.sendWithPlainText(user!.email, 'restoration', {code: restoration.code}, undefined, user.language as any);
            if (restorationSent.isFailure) {
                console.log(restorationSent.getError())
                return Result.fail(UseCaseError.create('a', 'Error upon sending restoration'));
            }
        }

        await this.restorationRepo.save(restoration);

        return Result.ok({restorationId: req.restorationId});
    }
}