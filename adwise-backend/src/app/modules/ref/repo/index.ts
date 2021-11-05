import { RefModel } from "../models/Ref";
import { RefRepo } from "./implementation/RefRepo";

const refRepo = new RefRepo(RefModel);

export {
    refRepo
};