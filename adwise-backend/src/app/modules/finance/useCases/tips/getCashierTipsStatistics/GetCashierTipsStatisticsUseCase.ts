import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { getCashierTipsErrors } from "../getCashierTips/getCashierTipsErrors";
import { GetCashierTipsStatisticsDTO } from "./GetCashierTipsStatisticsDTO";

export class GetCashierTipsStatisticsUseCase implements IUseCase<GetCashierTipsStatisticsDTO.Request, GetCashierTipsStatisticsDTO.Response> {
    private transactionRepo: ITransactionRepo;
    private contactRepo: IContactRepo;
    private userRepo: IUserRepo;

    public errors = getCashierTipsErrors;

    constructor(transactionRepo: ITransactionRepo, contactRepo: IContactRepo, userRepo: IUserRepo) {
        this.transactionRepo = transactionRepo;
        this.contactRepo = contactRepo;
        this.userRepo = userRepo;
    }

    public async execute(req: GetCashierTipsStatisticsDTO.Request): Promise<GetCashierTipsStatisticsDTO.Response> {
        if (!Types.ObjectId.isValid(req.cashierContactId)) {
            return Result.fail(UseCaseError.create('c', 'cashierContactId is not valid'));
        }

        const contactFound = await this.contactRepo.findById(req.cashierContactId);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding contact') : UseCaseError.create('w'));
        }

        const contact = contactFound.getValue()!;

        const userFound = await this.userRepo.findById(contact.ref.toString());
        if (userFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
        }

        const user = userFound.getValue()!;

        const tipsTransactionsFound = await this.transactionRepo.findByTypeAndTo('tips', user.wallet.toString());
        if (tipsTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding tips transactions'));
        } 

        const tipsTransactions = tipsTransactionsFound.getValue()!;
        
        const tips: GetCashierTipsStatisticsDTO.ITips[] = tipsTransactions.map(t => {
            return {
                sum: t.sum,
                timestamp: t.timestamp
            };
        });

        const tipsSum = tips.reduce((sum, cur) => sum += cur.sum, 0);
        const tipsCount = tips.length;

        return Result.ok({tipsCount, tipsSum});
    }
}