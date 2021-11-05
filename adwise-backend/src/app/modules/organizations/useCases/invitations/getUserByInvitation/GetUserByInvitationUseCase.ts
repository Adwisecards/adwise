import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscriptionRepo } from "../../../../finance/repo/subscriptions/ISubscriptionRepo";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IInvitationRepo } from "../../../repo/invitations/IInvitationRepo";
import { GetUserByInvitationDTO } from "./GetUserByInvitationDTO";
import { getUserByInvitationErrors } from "./getUserByInvitationErrors";

export class GetUserByInvitationUseCase implements IUseCase<GetUserByInvitationDTO.Request, GetUserByInvitationDTO.Response> {
    private userRepo: IUserRepo;
    private invitationRepo: IInvitationRepo;
    private subscriptionRepo: ISubscriptionRepo;

    public errors = getUserByInvitationErrors;

    constructor(userRepo: IUserRepo, invitationRepo: IInvitationRepo, subscriptionRepo: ISubscriptionRepo) {
        this.userRepo = userRepo;
        this.invitationRepo = invitationRepo;
        this.subscriptionRepo = subscriptionRepo;
    }

    public async execute(req: GetUserByInvitationDTO.Request): Promise<GetUserByInvitationDTO.Response> {
        if (!Types.ObjectId.isValid(req.invitationId)) {
            return Result.fail(UseCaseError.create('c', 'invitationId is not valid'));
        }

        const invitationFound = await this.invitationRepo.findById(req.invitationId);
        if (invitationFound.isFailure) {
            return Result.fail(invitationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding invitation') : UseCaseError.create('o'));
        }

        const invitation = invitationFound.getValue()!;

        const subscriptionFound = await this.subscriptionRepo.findById(invitation.subscription.toString());
        if (subscriptionFound.isFailure) {
            return Result.fail(subscriptionFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding subscription') : UseCaseError.create('n', 'Subscription does not exist'))
        }

        const subscription = subscriptionFound.getValue()!;

        const userFound = await this.userRepo.findById(subscription.subscriber.toString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        return Result.ok({user});
    }
}