import { logger } from "../../../../services/logger";
import { GetSystemLogFileController } from "./GetSystemLogFileController";
import { GetSystemLogFileUseCase } from "./GetSystemLogFileUseCase";

export const getSystemLogFileUseCase = new GetSystemLogFileUseCase(logger);
export const getSystemLogFileController = new GetSystemLogFileController(getSystemLogFileUseCase);