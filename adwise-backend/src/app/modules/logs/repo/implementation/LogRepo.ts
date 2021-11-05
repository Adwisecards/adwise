import { Repo } from "../../../../core/models/Repo";
import { ILog, ILogModel } from "../../models/Log";
import { ILogRepo } from "../ILogRepo";

export class LogRepo extends Repo<ILog, ILogModel> implements ILogRepo {
    
}