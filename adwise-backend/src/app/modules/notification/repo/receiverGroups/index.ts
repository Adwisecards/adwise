import { ReceiverGroupModel } from "../../models/ReceiverGroup";
import { ReceiverGroupRepo } from "./implementation/ReceiverGroupRepo";

export const receiverGroupRepo = new ReceiverGroupRepo(ReceiverGroupModel);