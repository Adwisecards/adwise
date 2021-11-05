import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IPurchaseRepo } from "../../../repo/purchases/IPurchaseRepo";
import { IWalletRepo } from "../../../repo/wallets/IWalletRepo";
import { GetCashierPurchaseStatisticsDTO } from "./GetCashierPurchaseStatisticsDTO";
import { getCashierPurchaseStatisticsErrors } from "./getCashierPurchaseStatisticsErrors";

export class GetCashierPurchaseStatisticsUseCase implements IUseCase<GetCashierPurchaseStatisticsDTO.Request, GetCashierPurchaseStatisticsDTO.Response> {
    private purchaseRepo: IPurchaseRepo;
    private userRepo: IUserRepo;
    private contactRepo: IContactRepo;
    private walletRepo: IWalletRepo;

    public errors = getCashierPurchaseStatisticsErrors;

    constructor(purchaseRepo: IPurchaseRepo, userRepo: IUserRepo, contactRepo: IContactRepo, walletRepo: IWalletRepo) {
        this.purchaseRepo = purchaseRepo;
        this.userRepo = userRepo;
        this.contactRepo = contactRepo;
        this.walletRepo = walletRepo;
    }

    public async execute(req: GetCashierPurchaseStatisticsDTO.Request): Promise<GetCashierPurchaseStatisticsDTO.Response> {
        if (!Types.ObjectId.isValid(req.cashierUserId)) {
            return Result.fail(UseCaseError.create('c', 'cashierUserId is not valid'));
        }

        const cashierUserFound = (await this.userRepo.findById(req.cashierUserId));
        if (cashierUserFound.isFailure) {
            return Result.fail(cashierUserFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding cashier user') : UseCaseError.create('m'));
        }

        const cashierUser = cashierUserFound.getValue()!;

        const workCashierContactsFound = await this.contactRepo.findByUserAndType(cashierUser._id.toString(), 'work');
        if (workCashierContactsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding cashier contacts'));
        }

        const workCashierContacts = workCashierContactsFound.getValue()!;

        console.log(workCashierContacts);

        const cashierContact = workCashierContacts.find((c: any) => {
            return !c.employee.disabled && c.employee.role == 'cashier';
        });

        if (!cashierContact) {
            return Result.fail(UseCaseError.create('c', 'User is not a cashier'));
        }

        const purchasesFound = await this.purchaseRepo.findByCashierAndComplete(cashierContact!._id.toString(), true);
        if (purchasesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding purchases'));
        }

        const walletFound = await this.walletRepo.findById(cashierUser.wallet.toString());
        if (walletFound.isFailure) {
            return Result.fail(walletFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding wallet') : UseCaseError.create('r'));
        }

        const wallet = walletFound.getValue()!;

        const purchases = purchasesFound.getValue()!;

        const purchaseCount = purchases.length;
        const purchaseSum = purchases.reduce((sum, cur) => sum += cur.sumInPoints, 0);

        return Result.ok({
            points: wallet.points + wallet.cashbackPoints + wallet.bonusPoints,
            purchaseCount,
            purchaseSum
        });
    }
}