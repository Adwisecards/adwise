import { Repo } from "../../../../../core/models/Repo";
import { IMessage, IMessageModel } from "../../../models/Message";
import { IMessageRepo } from "../IMessageRepo";

export class MessageRepo extends Repo<IMessage, IMessageModel> implements IMessageRepo {
    
}