import { Repo } from "../../../../../core/models/Repo";
import { IReceiverGroup, IReceiverGroupModel } from "../../../models/ReceiverGroup";
import { IReceiverGroupRepo } from "../IReceiverGroupRepo";

export class ReceiverGroupRepo extends Repo<IReceiverGroup, IReceiverGroupModel> implements IReceiverGroupRepo {

}