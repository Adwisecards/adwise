import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import Currency from "../../../../../core/static/Currency";
import { ICurrencyService } from "../../../../../services/currencyService/ICurrencyService";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { ChangeCurrencyDTO } from "./ChangeCurrencyDTO";
import { changeCurrencyErrors } from "./changeCurrencyErrors";

export class ChangeCurrencyUseCase implements IUseCase<ChangeCurrencyDTO.Request, ChangeCurrencyDTO.Response> {
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private walletRepo: IWalletRepo;
    private currencyService: ICurrencyService;
    public errors: UseCaseError[] = [
        ...changeCurrencyErrors
    ];
    constructor(userRepo: IUserRepo, organizationRepo: IOrganizationRepo, walletRepo: IWalletRepo, currencyService: ICurrencyService) {
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.walletRepo = walletRepo;
        this.currencyService = currencyService;
    }

    public async execute(req: ChangeCurrencyDTO.Request): Promise<ChangeCurrencyDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId) || !Currency.isValid(req.currency)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const userWalletFound = await this.walletRepo.findById(user.wallet.toHexString());
        if (userWalletFound.isFailure) {
            return Result.fail(userWalletFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('r'));
        }

        const userWallet = userWalletFound.getValue()!;

        const exchangeMade = await this.currencyService.exchange(userWallet.currency, req.currency);
        if (exchangeMade.isFailure) {
            return Result.fail(UseCaseError.create('a', `Error in the process of exchange of ${userWallet.currency} and ${req.currency}`));
        }

        const exchange = exchangeMade.getValue()!;

        userWallet.currency = req.currency;
        userWallet.points = exchange * userWallet.points;
        
        const userWalletSaved = await this.walletRepo.save(userWallet);
        if (userWalletSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user wallet'));
        }

        const returnValue: ChangeCurrencyDTO.ResponseData = {
            userWalletId: userWallet._id
        };

        if (user.organization) {
            const organizationFound = await this.organizationRepo.findById(user.organization.toHexString());
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('l'));
            }

            const organization = organizationFound.getValue()!;

            const organizationWalletFound = await this.walletRepo.findById(organization.wallet.toHexString()!);
            if (organizationWalletFound.isFailure) {
                return Result.fail(organizationWalletFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('r'));
            }

            const organizationWallet = organizationWalletFound.getValue()!;

            organizationWallet.currency = req.currency;

            const organizationWalletSaved = await this.walletRepo.save(organizationWallet);
            if (organizationWalletSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving organization wallet'));
            }

            returnValue.organizationWalletId = organizationWallet._id;
        }



        return Result.ok(returnValue)
    }
}