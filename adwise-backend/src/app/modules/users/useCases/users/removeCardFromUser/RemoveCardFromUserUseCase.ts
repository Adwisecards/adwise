import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPaymentService } from "../../../../../services/paymentService/IPaymentService";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { RemoveCardFromUserDTO } from "./RemoveCardFromUserDTO";
import { removeCardFromUserErrors } from "./removeCardFromUserErrors";

export class RemoveCardFromUserUseCase implements IUseCase<RemoveCardFromUserDTO.Request, RemoveCardFromUserDTO.Response> {
    private userRepo: IUserRepo;
    private paymentService: IPaymentService;

    public errors = removeCardFromUserErrors;

    constructor(userRepo: IUserRepo, paymentService: IPaymentService) {
        this.userRepo = userRepo;
        this.paymentService = paymentService;
    }

    public async execute(req: RemoveCardFromUserDTO.Request): Promise<RemoveCardFromUserDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('a', 'userId is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        if (!user.paymentCardId) {
            return Result.fail(UseCaseError.create('c', 'User has no card'));
        }

        const cardRemoved = await this.paymentService.deleteCard(user.paymentCustomerId, user.paymentCardId);
        if (cardRemoved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon removing card'));
        }

        user.paymentCardId = '';

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        return Result.ok({success: true});
    }
}