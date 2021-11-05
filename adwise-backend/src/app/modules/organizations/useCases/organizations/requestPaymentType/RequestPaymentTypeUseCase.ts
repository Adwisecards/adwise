import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { emailService } from "../../../../../services/emailService";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { RequestPaymentTypeDTO } from "./RequestPaymentTypeDTO";
import { requestPaymentTypeErrors } from "./requestPaymentTypeErrors";

export class RequestPaymentTypeUseCase implements IUseCase<RequestPaymentTypeDTO.Request, RequestPaymentTypeDTO.Response> {
    private userRepo: IUserRepo;
    private globalRepo: IGlobalRepo;
    private emailService: IEmailService;
    private organizationRepo: IOrganizationRepo;
    private organizationValidationService: IOrganizationValidationService;

    public errors = requestPaymentTypeErrors;

    constructor(
        userRepo: IUserRepo,
        globalRepo: IGlobalRepo,
        emailService: IEmailService,
        organizationRepo: IOrganizationRepo,
        organizationValidationService: IOrganizationValidationService
    ) {
        this.userRepo = userRepo;
        this.globalRepo = globalRepo;
        this.emailService = emailService;
        this.organizationRepo = organizationRepo;
        this.organizationValidationService = organizationValidationService;
    }

    public async execute(req: RequestPaymentTypeDTO.Request): Promise<RequestPaymentTypeDTO.Response> {
        const valid = this.organizationValidationService.requestPaymentTypeData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const userFound = await this.userRepo.findById(organization.user.toString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        if (organization.user.toString() != req.userId) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        if (organization.paymentType == req.paymentType) {
            return Result.fail(UseCaseError.create('c', 'The same payment type is already set'));
        }

        // if (req.paymentType == 'split' && !organization.paymentShopId) {
        //     return Result.fail(UseCaseError.create('c', 'Organization has no shop id'));
        // }

        // if (req.paymentType == 'safe' && !user.paymentCardId) {
        //     return Result.fail(UseCaseError.create('c', 'Organization has no card'));
        // }

        const emailSent = await emailService.sendToMultipleWithPlainText([global.contactEmail, ...global.spareContactEmails], 'paymentTypeRequest', {
            name: organization.name,
            paymentType: this.formatOrganizationPaymentType(req.paymentType)
        });

        if (emailSent.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon sending email'));
        }

        return Result.ok({success: true});
    }

    private formatOrganizationPaymentType(paymentType: string): string {
        if (paymentType == 'default') return 'Классический терминал';
        else if (paymentType == 'split') return 'Сплитование';
        else return 'Безопасная сделка'
    }
}