import { TagModel } from "../../models/Tag";
import { TagRepo } from "./implementation/TagRepo";

const tagRepo = new TagRepo(TagModel);

export {
    tagRepo
};