import { InvitationModel } from "../../models/Invitation";
import { InvitationRepo } from "./implementation/InvitationRepo";

const invitationRepo = new InvitationRepo(InvitationModel);

export {
    invitationRepo
};