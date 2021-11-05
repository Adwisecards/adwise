import { invitationRepo } from "../../../../organizations/repo/invitations";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllInvitationsController } from "./FindAllInvitationsController";
import { FindAllInvitationsUseCase } from "./FindAllInvitationsUseCase";

export const findAllInvitationsUseCase = new FindAllInvitationsUseCase(
    invitationRepo, 
    administrationValidationService
);

export const findAllInvitationsController = new FindAllInvitationsController(findAllInvitationsUseCase);