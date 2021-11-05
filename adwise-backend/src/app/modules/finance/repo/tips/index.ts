import { TipsModel } from "../../models/Tips";
import { TipsRepo } from "./implementation/TipsRepo";

export const tipsRepo = new TipsRepo(TipsModel);