import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import InvitationType from "../../../../../core/static/InvitationType";
import { ISubscriptionRepo } from "../../../../finance/repo/subscriptions/ISubscriptionRepo";
import { CreateRefUseCase } from "../../../../ref/useCases/createRef/CreateRefUseCase";
import { InvitationModel } from "../../../models/Invitation";
import { IInvitationRepo } from "../../../repo/invitations/IInvitationRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { CreateInvitationDTO } from "./CreateInvitationDTO";
import { createInvitationErrors } from "./createInvitationErrors";

export class CreateInvitationUseCase implements IUseCase<CreateInvitationDTO.Request, CreateInvitationDTO.Response> {
    private subscriptionRepo: ISubscriptionRepo;
    private invitationRepo: IInvitationRepo;
    private organizationRepo: IOrganizationRepo;
    private createRefUseCase: CreateRefUseCase;

    public errors: UseCaseError[] = [
        ...createInvitationErrors
    ];
    constructor(
        subscriptionRepo: ISubscriptionRepo, 
        invitationRepo: IInvitationRepo, 
        organizationRepo: IOrganizationRepo, 
        createRefUseCase: CreateRefUseCase
    ) {
        this.subscriptionRepo = subscriptionRepo;
        this.invitationRepo = invitationRepo;
        this.organizationRepo = organizationRepo;
        this.createRefUseCase = createRefUseCase;
    }

    public async execute(req: CreateInvitationDTO.Request): Promise<CreateInvitationDTO.Response> {
        if ((req.invitationType && !InvitationType.isValid(req.invitationType)) || !Types.ObjectId.isValid(req.userId) || !Types.ObjectId.isValid(req.organizationId) || (req.couponId && !Types.ObjectId.isValid(req.couponId))) {
            return Result.fail(UseCaseError.create('c'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        if (organization.disabled) {
            return Result.fail(UseCaseError.create('c', 'Organization is disabled'));
        }

        const subscriptionFound = await this.subscriptionRepo.findByUserAndOrganization(req.userId, req.organizationId);
        if (subscriptionFound.isFailure) {
            return Result.fail(subscriptionFound.getError()!.code == 500 ? UseCaseError.create('a', 'error upon finding subscription') : UseCaseError.create('n'));
        }

        const subscription = subscriptionFound.getValue()!;

        const invitation = new InvitationModel({
            organization: req.organizationId,
            subscription: subscription._id,
            invitationType: req.invitationType || 'invitation'
        });
        if (req.couponId) {
            invitation.coupon = new Types.ObjectId(req.couponId);
        }

        const refCreated = await this.createRefUseCase.execute({
            ref: invitation._id,
            mode: 'organization',
            type: 'invitation'
        });

        if (refCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
        }

        const ref = refCreated.getValue()!;

        invitation.ref = ref;

        const invitationSaved = await this.invitationRepo.save(invitation);
        if (invitationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving invitation'));
        }

        return Result.ok({invitation: invitation});
    }
};