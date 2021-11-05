import { Repo } from "../../../../../core/models/Repo";
import { IChat, IChatModel } from "../../../models/Chat";
import { IChatRepo } from "../IChatRepo";

export class ChatRepo extends Repo<IChat, IChatModel> implements IChatRepo {

}