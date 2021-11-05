import { RestorationModel } from "../../models/Restoration";
import { RestorationRepo } from "./implementation/RestorationRepo";

const restorationRepo = new RestorationRepo(RestorationModel);

export {
    restorationRepo
};