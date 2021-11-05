import { mediaService } from "../../../../services/mediaService";
import { GetFileController } from "./GetFileController";
import { GetFileUseCase } from "./GetFileUseCase";

export const getFileUseCase = new GetFileUseCase(mediaService);
export const getFileController = new GetFileController(getFileUseCase);