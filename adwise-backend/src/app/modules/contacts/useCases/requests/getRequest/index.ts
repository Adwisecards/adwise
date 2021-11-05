import { requestRepo } from "../../../repo/requests";
import { GetRequestController } from "./GetRequestController";
import { GetRequestUseCase } from "./GetRequestUseCase";

const getRequestUseCase = new GetRequestUseCase(requestRepo);
const getRequestController = new GetRequestController(getRequestUseCase);

export {
    getRequestController,
    getRequestUseCase
};