import { Repo } from "../../../../../core/models/Repo";
import { IAdvantage, IAdvantageModel } from "../../../models/Advantage";
import { IAdvantageRepo } from "../IAdvantageRepo";

export class AdvantageRepo extends Repo<IAdvantage, IAdvantageModel> implements IAdvantageRepo {
    
}