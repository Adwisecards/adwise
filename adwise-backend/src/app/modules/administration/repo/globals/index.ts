import { GlobalModel } from "../../models/Global";
import { GlobalRepo } from "./implementation/GlobalRepo";

const globalRepo = new GlobalRepo(GlobalModel);

export {
    globalRepo
};