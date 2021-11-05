import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IInvitationRepo } from "../../../repo/invitations/IInvitationRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { GetOrganizationByInvitationDTO } from "./GetOrganizationByInvitationDTO";
import { getOrganizationByInvitationErrors } from "./getOrganizationByInvitationErrors";

export class GetOrganizationByInvitationUseCase implements IUseCase<GetOrganizationByInvitationDTO.Request, GetOrganizationByInvitationDTO.Response> {
    private invitationRepo: IInvitationRepo;
    private organizationRepo: IOrganizationRepo;
    public errors: UseCaseError[] = [
        ...getOrganizationByInvitationErrors
    ];
    constructor(invitationRepo: IInvitationRepo, organizationRepo: IOrganizationRepo) {
        this.invitationRepo = invitationRepo;
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: GetOrganizationByInvitationDTO.Request): Promise<GetOrganizationByInvitationDTO.Response> {
        if (!Types.ObjectId.isValid(req.invitationId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const invitationFound = await this.invitationRepo.findById(req.invitationId);
        if (invitationFound.isFailure) {
            return Result.fail(invitationFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('o'));
        }

        const invitation = invitationFound.getValue()!;
        
        const organizationFound = await this.organizationRepo.findById(invitation.organization.toHexString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        return Result.ok({organization});
    }
}