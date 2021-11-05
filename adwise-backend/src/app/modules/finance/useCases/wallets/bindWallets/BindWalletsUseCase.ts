import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { BindWalletsDTO } from "./BindWalletsDTO";
import { bindWalletsErrors } from "./bindWalletsErrors";

export class BindWalletsUseCase implements IUseCase<BindWalletsDTO.Request, BindWalletsDTO.Response> {
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private walletRepo: IWalletRepo;

    public errors = [
        ...bindWalletsErrors
    ];

    constructor(userRepo: IUserRepo, organizationRepo: IOrganizationRepo, walletRepo: IWalletRepo) {
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.walletRepo = walletRepo;
    }

    public async execute(_: BindWalletsDTO.Request): Promise<BindWalletsDTO.Response> {
        const walletsFound = await this.walletRepo.getAll();
        if (walletsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding errors'));
        }

        const wallets = walletsFound.getValue()!;
        console.log(wallets);
        const changedWallets: string[] = [];
        for (const wallet of wallets) {
            console.log(wallet._id);
            if (wallet.organization || wallet.user) continue;

            const organizationFound = await this.organizationRepo.findByWallet(wallet._id);
            if (organizationFound.isSuccess) {
                const organization = organizationFound.getValue()!;
                wallet.organization = organization._id;
            } else {
                const userFound = await this.userRepo.findByWallet(wallet._id);
                if (userFound.isSuccess) {
                    const user = userFound.getValue()!;
                    wallet.user = user._id;
                }
            }

            const walletSaved = await this.walletRepo.save(wallet);
            if (walletSaved.isSuccess) {
                changedWallets.push(wallet._id);
            }
        }

        return Result.ok({
            walletIds: changedWallets
        });
    }
}