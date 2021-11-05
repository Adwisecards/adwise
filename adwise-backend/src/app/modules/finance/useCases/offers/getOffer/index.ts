import { offerRepo } from "../../../repo/offers";
import { GetOfferController } from "./GetOfferController";
import { GetOfferUseCase } from "./GetOfferUseCase";

export const getOfferUseCase = new GetOfferUseCase(offerRepo);
export const getOfferController = new GetOfferController(getOfferUseCase);