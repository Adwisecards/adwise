import { CategoryModel } from "../../models/Category";
import { CategoryRepo } from "./implementation/CategoryRepo";

const categoryRepo = new CategoryRepo(CategoryModel);

export {
    categoryRepo
};