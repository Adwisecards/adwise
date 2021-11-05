import { OfferModel } from "../../models/Offer";
import { OfferRepo } from "./implementation/OfferRepo";

const offerRepo = new OfferRepo(OfferModel);

export {
    offerRepo
};