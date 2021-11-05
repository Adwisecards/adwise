import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../services/mediaService/IMediaService";
import { GetFileDTO } from "./GetFileDTO";
import { getFileErrors } from "./getFileErrors";
import { lookup } from 'mime-types';

export class GetFileUseCase implements IUseCase<GetFileDTO.Request, GetFileDTO.Response> {
    private mediaService: IMediaService;

    public errors = getFileErrors;

    constructor(mediaService: IMediaService) {
        this.mediaService = mediaService;
    }

    public async execute(req: GetFileDTO.Request): Promise<GetFileDTO.Response> {
        const mimeType = lookup(req.filename) || 'undefined';
        
        if (!req.filename) {
            return Result.fail(UseCaseError.create('c', 'filename is not valid'));
        }

        const fileGotten = await this.mediaService.get(req.filename);
        if (fileGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting file'));
        }

        const data = fileGotten.getValue()!;

        return Result.ok({data, mimeType});
    }
}