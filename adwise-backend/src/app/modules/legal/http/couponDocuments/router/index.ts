import { Router } from "express";
import { applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { getCouponDocumentsController } from "../../../useCases/couponDocuments/getCouponDocuments";

export const couponDocumentRouter = Router();

couponDocumentRouter.get('/get-coupon-documents/:id', applyBlock, (req, res) => getCouponDocumentsController.execute(req, res));

/*
[
    {
        "name": "get coupon documents",
        "path": "/legal/get-coupon-documents/{couponId}",
        "dto": "src/app/modules/legal/useCases/couponDocuments/getCouponDocuments/GetCouponDocumentsDTO.ts",
        "errors": "src/app/modules/legal/useCases/couponDocuments/getCouponDocuments/getCouponDocumentsErrors.ts",
        "method": "GET",
        "description": "Возвращает все документы купона."
    }
]
*/