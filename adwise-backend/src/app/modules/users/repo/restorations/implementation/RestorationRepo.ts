import { Repo } from "../../../../../core/models/Repo";
import { IRestoration, IRestorationModel } from "../../../models/Restoration";
import { IRestorationRepo } from "../IRestorationRepo";

export class RestorationRepo extends Repo<IRestoration, IRestorationModel> implements IRestorationRepo {}