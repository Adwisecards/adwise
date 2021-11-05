import { Repo } from "../../../../../core/models/Repo";
import { IOffer, IOfferModel } from "../../../models/Offer";
import { IOfferRepo } from "../IOfferRepo";

export class OfferRepo extends Repo<IOffer, IOfferModel> implements IOfferRepo {

}