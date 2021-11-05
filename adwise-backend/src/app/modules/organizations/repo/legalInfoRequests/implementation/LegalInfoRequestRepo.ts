import { Repo } from "../../../../../core/models/Repo";
import { ILegalInfoRequest, ILegalInfoRequestModel } from "../../../models/LegalInfoRequest";
import { ILegalInfoRequestRepo } from "../ILegalInfoRequestRepo";

export class LegalInfoRequestRepo extends Repo<ILegalInfoRequest, ILegalInfoRequestModel> implements ILegalInfoRequestRepo {
    
}