import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWalletRepo } from "../../../../finance/repo/wallets/IWalletRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { IncreaseOrganizationDepositDTO } from "./IncreaseOrganizationDepositDTO";
import { increaseOrganizationDepositErrors } from "./increaseOrganizationDepositErrors";

export class IncreaseOrganizationDepositUseCase implements IUseCase<IncreaseOrganizationDepositDTO.Request, IncreaseOrganizationDepositDTO.Response> {
    private walletRepo: IWalletRepo;
    private organizationRepo: IOrganizationRepo;
    private organizationValidationService: IOrganizationValidationService;

    public errors = increaseOrganizationDepositErrors;

    constructor(
        walletRepo: IWalletRepo,
        organizationRepo: IOrganizationRepo,
        organizationValidationService: IOrganizationValidationService
    ) {
        this.walletRepo = walletRepo;
        this.organizationRepo = organizationRepo;
        this.organizationValidationService = organizationValidationService;
    }

    public async execute(req: IncreaseOrganizationDepositDTO.Request): Promise<IncreaseOrganizationDepositDTO.Response> {
        const valid = this.organizationValidationService.increaseOrganizationDepositData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        if (organization.user.toString() == req.userId) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        const walletFound = await this.walletRepo.findById(organization.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        // organization.deposit += req.sum;

        // if (wallet.points < organization.deposit) {
        //     return Result.fail(UseCaseError.create('c', 'Deposit cannot be greater than wallet balance'));
        // }
        
        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok({organizationId: organization._id});
    }
}