import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { createRefUseCase } from "../../../../ref/useCases/createRef";
import { invitationRepo } from "../../../repo/invitations";
import { organizationRepo } from "../../../repo/organizations";
import { CreateInvitationController } from "./CreateInvitationController";
import { CreateInvitationUseCase } from "./CreateInvitationUseCase";

const createInvitationUseCase = new CreateInvitationUseCase(
    subscriptionRepo, 
    invitationRepo, 
    organizationRepo, 
    createRefUseCase
);
const createInvitationController = new CreateInvitationController(createInvitationUseCase);

export {
    createInvitationUseCase,
    createInvitationController
};