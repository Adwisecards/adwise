import { PurchaseModel } from "../../models/Purchase";
import { PurchaseRepo } from "./implementation/PurchaseRepo";

const purchaseRepo = new PurchaseRepo(PurchaseModel);

export {
    purchaseRepo
};