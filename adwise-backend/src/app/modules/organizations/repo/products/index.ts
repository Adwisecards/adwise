import { ProductModel } from "../../models/Product";
import { ProductRepo } from "./implementation/ProductRepo";

const productRepo = new ProductRepo(ProductModel);

export {
    productRepo
};