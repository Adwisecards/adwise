import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPaymentService } from "../../../../../services/paymentService/IPaymentService";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { GetUserCardDTO } from "./GetUserCardDTO";
import { getUserCardErrors } from "./getUserCardErrors";

export class GetUserCardUseCase implements IUseCase<GetUserCardDTO.Request, GetUserCardDTO.Response> {
    private userRepo: IUserRepo;
    private paymentService: IPaymentService;

    public errors = getUserCardErrors;

    constructor(userRepo: IUserRepo, paymentService: IPaymentService) {
        this.userRepo = userRepo;
        this.paymentService = paymentService;
    }

    public async execute(req: GetUserCardDTO.Request): Promise<GetUserCardDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
           return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }
        
        const user = userFound.getValue()!;

        if (!user.paymentCardId) {
            return Result.ok({card: null});
        }

        const cardsGotten = await this.paymentService.getCards(user.paymentCustomerId);
        if (cardsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting user cards'));
        }

        const cards = cardsGotten.getValue()!;

        const activeCard = cards.find(c => c.Status == 'A');

        if (!activeCard) {
            return Result.ok({card: null});
        }

        return Result.ok({card: activeCard});
    }
}