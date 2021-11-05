import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";

export class UnfreezePointsUseCase implements IUseCase<any, any> {
    public errors = [

    ];
    
    private globalRepo: IGlobalRepo;
    private walletRepo: IWalletRepo;
    constructor(walletRepo: IWalletRepo, globalRepo: IGlobalRepo) {
        this.walletRepo = walletRepo;
        this.globalRepo = globalRepo;
    }

    public async execute(_: any): Promise<any> {
        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(null);
        }

        const global = globalGotten.getValue()!;

        const date = new Date();
        date.setDate(date.getDate()-global.balanceUnfreezeTerms); //14

        const walletsFound = await this.walletRepo.findByFrozenSumDate(date);
        if (walletsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding wallets'));
        }

        const wallets = walletsFound.getValue()!;

        for (const wallet of wallets) {
            for (const recordIndex in wallet.frozenPoints) {
                if (wallet.frozenPoints[recordIndex].timestamp.getTime() < date.getTime()) {
                    switch (wallet.frozenPoints[recordIndex].type) {
                        case 'bonus':
                            wallet.bonusPoints += wallet.frozenPoints[recordIndex].sum;
                            break
                        case 'cashback':
                            wallet.cashbackPoints += wallet.frozenPoints[recordIndex].sum;
                            break;
                        case 'points':
                            wallet.points += wallet.frozenPoints[recordIndex].sum;
                            break;
                        default:
                            wallet.bonusPoints += wallet.frozenPoints[recordIndex].sum;
                            break
                    }
                    wallet.frozenPoints.splice(Number.parseInt(recordIndex), 1)!;
                }
            }

            await this.walletRepo.save(wallet);
        }

        return Result.ok(wallets);
    }
}