import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { WithdrawalRequest } from "../../../models/WithdrawalRequest";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { IWithdrawalRequestRepo } from "../../../repo/withdrawalRequests/IWithdrawalRequestRepo";
import { IWithdrawalRequestValidationService } from "../../../services/withdrawalRequests/withdrawalRequestValidationService/IWithdrawalRequestValidationService";
import { CreateLegalWithdrawalRequestDTO } from "./CreateLegalWithdrawalRequestDTO";
import { createLegalWithdrawalRequestErrors } from "./createLegalWithdrawalRequestErrors";

export class CreateLegalWithdrawalRequestUseCase implements IUseCase<CreateLegalWithdrawalRequestDTO.Request, CreateLegalWithdrawalRequestDTO.Response> {
    private withdrawalRequestRepo: IWithdrawalRequestRepo;
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private withdrawalRequestValidationService: IWithdrawalRequestValidationService;
    private walletRepo: IWalletRepo;
    private globalRepo: IGlobalRepo;
    private emailService: IEmailService;
    
    public errors = [
        ...createLegalWithdrawalRequestErrors
    ];

    constructor(withdrawalRequestRepo: IWithdrawalRequestRepo, userRepo: IUserRepo, organizationRepo: IOrganizationRepo, withdrawalRequestValidationService: IWithdrawalRequestValidationService, walletRepo: IWalletRepo, globalRepo: IGlobalRepo, emailService: IEmailService) {
        this.withdrawalRequestRepo = withdrawalRequestRepo;
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.withdrawalRequestValidationService = withdrawalRequestValidationService;
        this.walletRepo = walletRepo;
        this.globalRepo = globalRepo;
        this.emailService = emailService;
    }

    public async execute(req: CreateLegalWithdrawalRequestDTO.Request): Promise<CreateLegalWithdrawalRequestDTO.Response> {
        const valid = this.withdrawalRequestValidationService.createLegalWithdrawalRequestData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const globalFound = await this.globalRepo.getGlobal();
        if (globalFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalFound.getValue()!;

        const walletFound = await this.walletRepo.findById(req.walletId);
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        let organization: IOrganization | undefined;
        if (wallet.organization) {
            const organizationFound = await this.organizationRepo.findById(wallet.organization.toString());
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding organization") : UseCaseError.create('l'));
            }

            organization = organizationFound.getValue()!;
        }

        let user: IUser | undefined;
        if (wallet.user) {
            const userFound = await this.userRepo.findById(wallet.user.toString());
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
            } 

            user = userFound.getValue()!;
        }

        let availableBalance = (wallet.bonusPoints + wallet.points + wallet.cashbackPoints);

        if (availableBalance < req.sum) {
            return Result.fail(UseCaseError.create('t'));
        }

        const withdrawalRequest = new WithdrawalRequest({
            sum: req.sum,
            currency: wallet.currency,
            wallet: wallet._id,
            [wallet.organization ? 'organization' : 'user']: wallet.organization ? wallet.organization : wallet.user,
            comment: req.comment,
            timestamp: req.timestamp,
            organization: organization?._id,
            user: user?._id
        });

        const withdrawalRequestSaved = await this.withdrawalRequestRepo.save(withdrawalRequest);
        if (withdrawalRequestSaved.isFailure) {
            console.log(withdrawalRequestSaved.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon saving Withdrawal request'));
        }

        if (organization) {
            this.emailService.sendToMultipleWithPlainText([global.contactEmail, ...global.spareContactEmails], 'legalWithdrawalRequest', {
                name: organization.name,
                sum: req.sum,
                emails: organization.emails.join(', '),
                phones: organization.phones.join(', '),
            });
        }

        if (user) {
            this.emailService.sendToMultipleWithPlainText([global.contactEmail, ...global.spareContactEmails], 'legalWithdrawalRequest', {
                name: `${user?.firstName}${user?.lastName ? ' '+user?.lastName : ''}`,
                sum: req.sum,
                emails: [user.email, user.emailInfo].filter(v => !!v).join(', '),
                phones: [user.phone, user.phoneInfo].filter(v => !!v).join(', ')
            });
        }

        return Result.ok({
            withdrawalRequestId: withdrawalRequest._id
        });
    }
}