import { mediaRepo } from "../../repo";
import { mediaValidationService } from "../../services/mediaValidationService";
import { GetMediaController } from "./GetMediaController";
import { GetMediaUseCase } from "./GetMediaUseCase";

export const getMediaUseCase = new GetMediaUseCase(
    mediaRepo,
    mediaValidationService
);

export const getMediaController = new GetMediaController(getMediaUseCase);