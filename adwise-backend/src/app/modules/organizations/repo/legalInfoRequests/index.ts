import { LegalInfoRequestModel } from "../../models/LegalInfoRequest";
import { LegalInfoRequestRepo } from "./implementation/LegalInfoRequestRepo";

export const legalInfoRequestRepo = new LegalInfoRequestRepo(LegalInfoRequestModel);