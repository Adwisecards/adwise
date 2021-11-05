import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IRequestRepo } from "../../../repo/requests/IRequestRepo";
import { GetRequestDTO } from "./GetRequestDTO";
import { getRequestErrors } from "./getRequestErrors";

export class GetRequestUseCase implements IUseCase<GetRequestDTO.Request, GetRequestDTO.Response> {
    private requestRepo: IRequestRepo;
    public errors: UseCaseError[] = [
        ...getRequestErrors
    ];
    constructor(requestRepo: IRequestRepo) {
        this.requestRepo = requestRepo;
    }

    public async execute(req: GetRequestDTO.Request): Promise<GetRequestDTO.Response> {
        if (!Types.ObjectId.isValid(req.requestId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const requestFound = await this.requestRepo.findById(req.requestId);
        if (requestFound.isFailure) {
            return Result.fail(requestFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const request = requestFound.getValue()!;
        return Result.ok({request: request});
    }
}