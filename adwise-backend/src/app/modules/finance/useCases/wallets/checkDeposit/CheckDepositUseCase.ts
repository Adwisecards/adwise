import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { CreateOrganizationNotificationUseCase } from "../../../../organizations/useCases/organizationNotifications/createOrganizationNotification/CreateOrganizationNotificationUseCase";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { CheckDepositDTO } from "./CheckDepositDTO";
import { checkDepositErrors } from "./checkDepositErrors";

export class CheckDepositUseCase implements IUseCase<CheckDepositDTO.Request, CheckDepositDTO.Response> {
    private walletRepo: IWalletRepo;
    private createOrganizationNotificationsUseCase: CreateOrganizationNotificationUseCase;

    public errors = checkDepositErrors;

    constructor(
        walletRepo: IWalletRepo,
        createOrganizationNotificationUseCase: CreateOrganizationNotificationUseCase
    ) {
        this.walletRepo = walletRepo;
        this.createOrganizationNotificationsUseCase = createOrganizationNotificationUseCase;
    }

    public async execute(_: CheckDepositDTO.Request): Promise<CheckDepositDTO.Response> {
        const walletsGotten = await this.walletRepo.getAll();
        if (walletsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting wallets'));
        }

        const wallets = walletsGotten.getValue()!.filter(w => !!w.organization);

        for (const wallet of wallets) {
            if (wallet.deposit < 1000) {
                await this.createOrganizationNotificationsUseCase.execute({
                    organizationId: wallet.organization.toString(),
                    type: 'lowDeposit'
                });
            }
        }

        return Result.ok({});
    }
}