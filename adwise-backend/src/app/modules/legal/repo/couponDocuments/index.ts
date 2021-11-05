import { CouponDocumentModel } from "../../models/CouponDocument";
import { CouponDocumentRepo } from "./implementation/CouponDocumentRepo";

export const couponDocumentRepo = new CouponDocumentRepo(CouponDocumentModel);