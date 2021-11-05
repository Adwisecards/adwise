import { invitationRepo } from "../../../repo/invitations";
import { organizationRepo } from "../../../repo/organizations";
import { GetOrganizationByInvitationUseCase } from "./GetOrganizationByInvitationUseCase";
import { GetOrganizationByInvitationController } from './GetOrganizationByInvitationController';

const getOrganizationByInvitationUseCase = new GetOrganizationByInvitationUseCase(invitationRepo, organizationRepo);
const getOrganizationByInvitationController = new GetOrganizationByInvitationController(getOrganizationByInvitationUseCase);

export {
    getOrganizationByInvitationController,
    getOrganizationByInvitationUseCase
};