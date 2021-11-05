import { Request } from "express";
import MyRegexp from "myregexp";
import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../services/emailService/IEmailService";
import { IGlobalRepo } from "../../../administration/repo/globals/IGlobalRepo";
import { RequestCallDTO } from "./RequestCallDTO";
import { requestCallErrors } from "./requestCallErrors";

export class RequestCallUseCase implements IUseCase<RequestCallDTO.Request, RequestCallDTO.Response> {
    private emailService: IEmailService;
    private globalRepo: IGlobalRepo;
    public errors = [
        ...requestCallErrors
    ];

    constructor(emailService: IEmailService, globalRepo: IGlobalRepo) {
        this.emailService = emailService;
        this.globalRepo = globalRepo;
    }

    public async execute(req: RequestCallDTO.Request): Promise<RequestCallDTO.Response> {
        if (!req.name) {
            return Result.fail(UseCaseError.create('c', 'name is not valid'));
        }

        if (!MyRegexp.email().test(req.email)) {
            return Result.fail(UseCaseError.create('c', 'email is not valid'));
        }

        const globalGotten = await this.globalRepo.getGlobal()!;
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;


        const emailSent = await this.emailService.sendToMultipleWithPlainText([global.contactEmail, ...global.spareContactEmails], 'contact', {
            email: req.email
        });
        if (emailSent.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon sending email'));
        }

        return Result.ok({success: true});
    }
}