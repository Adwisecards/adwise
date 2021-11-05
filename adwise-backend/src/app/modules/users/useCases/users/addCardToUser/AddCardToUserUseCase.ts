import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPaymentService } from "../../../../../services/paymentService/IPaymentService";
import { CreateBankRequestUseCase } from "../../../../finance/useCases/bankRequests/createBankRequest/CreateBankRequestUseCase";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { AddCardToUserDTO } from "./AddCardToUserDTO";
import { addCardToUserErrors } from "./addCardToUserErrors";

export class AddCardToUserUseCase implements IUseCase<AddCardToUserDTO.Request, AddCardToUserDTO.Response> {
    private createBankRequestUseCase: CreateBankRequestUseCase;
    private userRepo: IUserRepo;
    private paymentService: IPaymentService;

    public errors = addCardToUserErrors;

    constructor(createBankRequestUseCase: CreateBankRequestUseCase, userRepo: IUserRepo, paymentService: IPaymentService) {
        this.createBankRequestUseCase = createBankRequestUseCase;
        this.userRepo = userRepo;
        this.paymentService = paymentService;
    }

    public async execute(req: AddCardToUserDTO.Request): Promise<AddCardToUserDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        if (user.paymentCardId) {
            return Result.fail(UseCaseError.create('f', 'User already has card'));
        }

        if (!user.paymentCustomerId) {
            const customerCreated = await this.paymentService.addCustomer(user._id.toString());
            if (customerCreated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon creating customer'));
            }

            const customer = customerCreated.getValue()!;

            user.paymentCustomerId = customer.CustomerKey;

            const userSaved = await this.userRepo.save(user);
            if (userSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
            }
        }

        const bankRequestCreated = await this.createBankRequestUseCase.execute({
            customerId: user.paymentCustomerId,
            ref: user._id.toString(),
            type: 'card'
        });

        if (bankRequestCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating bank request'));
        }

        const bankRequest = bankRequestCreated.getValue()!.bankRequest;

        return Result.ok({bankRequest});
    }
}