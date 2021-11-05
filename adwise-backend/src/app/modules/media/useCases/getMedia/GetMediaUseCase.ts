import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IMediaRepo } from "../../repo/IMediaRepo";
import { IMediaValidationService } from "../../services/mediaValidationService/IMediaValidationService";
import { GetMediaDTO } from "./GetMediaDTO";
import { getMediaErrors } from "./getMediaErrors";

export class GetMediaUseCase implements IUseCase<GetMediaDTO.Request, GetMediaDTO.Response> {
    private mediaRepo: IMediaRepo;
    private mediaValidationService: IMediaValidationService;

    public errors = getMediaErrors;

    constructor(
        mediaRepo: IMediaRepo,
        mediaValidationService: IMediaValidationService
    ) {
        this.mediaRepo = mediaRepo;
        this.mediaValidationService = mediaValidationService;
    }

    public async execute(req: GetMediaDTO.Request): Promise<GetMediaDTO.Response> {
        const valid = this.mediaValidationService.getMediaData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const mediaFound = await this.mediaRepo.findById(req.mediaId);
        if (mediaFound.isFailure) {
            return Result.fail(mediaFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding media') : UseCaseError.create('a5'));
        }

        const media = mediaFound.getValue()!;

        return Result.ok({media});
    }
}