import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { userRepo } from "../../../../users/repo/users";
import { invitationRepo } from "../../../repo/invitations";
import { GetUserByInvitationController } from "./GetUserByInvitationController";
import { GetUserByInvitationUseCase } from "./GetUserByInvitationUseCase";

export const getUserByInvitationUseCase = new GetUserByInvitationUseCase(userRepo, invitationRepo, subscriptionRepo);
export const getUserByInvitationController = new GetUserByInvitationController(getUserByInvitationUseCase);