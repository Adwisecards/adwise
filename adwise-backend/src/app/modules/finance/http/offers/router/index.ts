import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { getOfferController } from "../../../useCases/offers/getOffer";

const offerRouter = Router();

offerRouter.get('/get-offer/:id', applyBlock, applyAuth, (req, res) => getOfferController.execute(req, res));

export {
    offerRouter
};