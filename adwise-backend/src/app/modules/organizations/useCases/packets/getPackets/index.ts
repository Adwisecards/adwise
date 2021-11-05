import { packetRepo } from "../../../repo/packets";
import { GetPacketsController } from "./GetPacketsController";
import { GetPacketsUseCase } from "./GetPacketsUseCase";

const getPacketsUseCase = new GetPacketsUseCase(packetRepo);
const getPacketsController = new GetPacketsController(getPacketsUseCase);

export {
    getPacketsController,
    getPacketsUseCase
};