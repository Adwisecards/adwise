import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../../contacts/repo/contacts/IContactRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ITipsRepo } from "../../../repo/tips/ITipsRepo";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { ITipsValidationService } from "../../../services/tips/tipsValidationService/ITipsValidationService";
import { GetCashierTipsDTO } from "./GetCashierTipsDTO";
import { getCashierTipsErrors } from "./getCashierTipsErrors";

export class GetCashierTipsUseCase implements IUseCase<GetCashierTipsDTO.Request, GetCashierTipsDTO.Response> {
    private transactionRepo: ITransactionRepo;
    private userRepo: IUserRepo;
    private tipsValidationService: ITipsValidationService;
    private contactRepo: IContactRepo;

    public errors = getCashierTipsErrors;

    constructor(transactionRepo: ITransactionRepo, userRepo: IUserRepo, tipsValidationService: ITipsValidationService, contactRepo: IContactRepo) {
        this.transactionRepo = transactionRepo;
        this.userRepo = userRepo;
        this.tipsValidationService = tipsValidationService;
        this.contactRepo = contactRepo;
    }

    public async execute(req: GetCashierTipsDTO.Request): Promise<GetCashierTipsDTO.Response> {
        const valid = this.tipsValidationService.getCashierTipsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const contactFound = await this.contactRepo.findById(req.cashierContactId);
        if (contactFound.isFailure) {
            return Result.fail(contactFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding cashier') : UseCaseError.create('w'));
        }

        const contact = contactFound.getValue()!;

        const userFound = await this.userRepo.findById(contact.ref.toString());
        if (userFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
        }

        const user = userFound.getValue()!;

        const tipsTransactionsFound = await this.transactionRepo.findByTypeAndTo('tips', user.wallet.toString(), req.limit, req.page);
        if (tipsTransactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding tips transactions'));
        } 

        const tipsTransactions = tipsTransactionsFound.getValue()!;
        
        const tips: GetCashierTipsDTO.ITips[] = tipsTransactions.map(t => {
            return {
                sum: t.sum,
                timestamp: t.timestamp
            };
        });

        return Result.ok({tips});
    }
}