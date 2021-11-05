import { PartnerModel } from "../../models/Partner";
import { PartnerRepo } from "./implementation/PartnerRepo";

export const partnerRepo = new PartnerRepo(PartnerModel);