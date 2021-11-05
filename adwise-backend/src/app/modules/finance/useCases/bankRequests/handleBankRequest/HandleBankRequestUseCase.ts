import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IBankRequestRepo } from "../../../repo/bankRequests/IBankRequestRepo";
import { HandleBankRequestDTO } from "./HandleBankRequestDTO";
import { handleBankRequestErrors } from "./handleBankRequestErrors";

export class HandleBankRequestUseCase implements IUseCase<HandleBankRequestDTO.Request, HandleBankRequestDTO.Response> {
    private bankRequestRepo: IBankRequestRepo;
    private userRepo: IUserRepo;

    public errors = handleBankRequestErrors;

    constructor(bankRequestRepo: IBankRequestRepo, userRepo: IUserRepo) {
        this.bankRequestRepo = bankRequestRepo;
        this.userRepo = userRepo;
    }

    public async execute(req: HandleBankRequestDTO.Request): Promise<HandleBankRequestDTO.Response> {
        if (req.Status != 'COMPLETED') {
            return Result.fail(UseCaseError.create('c', 'Status is not valid'));
        }
        
        const bankRequestFound = await this.bankRequestRepo.findByRequestId(req.RequestKey);
        if (bankRequestFound.isFailure) {
            return Result.fail(bankRequestFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding bank request') : UseCaseError.create('b', 'Bank request does not exist'));
        }

        const bankRequest = bankRequestFound.getValue()!;

        const userFound = await this.userRepo.findById(bankRequest.ref.toString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        user.paymentCardId = req.CardId.toString();
        
        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        return Result.ok({success: true});
    }
}