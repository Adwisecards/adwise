import { Repo } from "../../../../../core/models/Repo";
import { IPartner, IPartnerModel } from "../../../models/Partner";
import { IPartnerRepo } from "../IPartnerRepo";

export class PartnerRepo extends Repo<IPartner, IPartnerModel> implements IPartnerRepo {
    
}