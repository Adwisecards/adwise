import { LegalModel } from "../../models/Legal";
import { LegalRepo } from "./implementation/LegalRepo";

export const legalRepo = new LegalRepo(LegalModel);