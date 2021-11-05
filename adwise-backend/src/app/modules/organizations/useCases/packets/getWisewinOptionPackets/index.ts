import { packetRepo } from "../../../repo/packets";
import { GetWisewinOptionPacketsController } from "./GetWisewinOptionPacketsController";
import { GetWisewinOptionPacketsUseCase } from "./GetWisewinOptionPacketsUseCase";

export const getWisewinOptionPacketsUseCase = new GetWisewinOptionPacketsUseCase(packetRepo);
export const getWisewinOptionPacketsController = new GetWisewinOptionPacketsController(getWisewinOptionPacketsUseCase);