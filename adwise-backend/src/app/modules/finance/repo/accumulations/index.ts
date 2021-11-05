import { AccumulationModel } from "../../models/Accumulation";
import { AccumulationRepo } from "./implementation/AccumulationRepo";

export const accumulationRepo = new AccumulationRepo(AccumulationModel);