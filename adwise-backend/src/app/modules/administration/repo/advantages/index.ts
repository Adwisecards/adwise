import { AdvantageModel } from "../../models/Advantage";
import { AdvantageRepo } from "./implementation/AdvantageRepo";

export const advantageRepo = new AdvantageRepo(AdvantageModel);