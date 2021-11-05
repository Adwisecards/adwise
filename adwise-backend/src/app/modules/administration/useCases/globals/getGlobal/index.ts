import { globalRepo } from "../../../repo/globals";
import { GetGlobalController } from "./GetGlobalController";
import { GetGlobalUseCase } from "./GetGlobalUseCase";

const getGlobalUseCase = new GetGlobalUseCase(globalRepo);
const getGlobalController = new GetGlobalController(getGlobalUseCase);

export {
    getGlobalUseCase,
    getGlobalController
};