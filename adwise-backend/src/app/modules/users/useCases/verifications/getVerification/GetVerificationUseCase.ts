import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IVerificationRepo } from "../../../repo/verifications/IVerificationRepo";
import { GetVerificationDTO } from "./GetVerificationDTO";
import { getVerificationErrors } from "./getVerificationErrors";

export class GetVerificationUseCase implements IUseCase<GetVerificationDTO.Request, GetVerificationDTO.Response> {
    private verificationRepo: IVerificationRepo;
    public errors: UseCaseError[] = [
        ...getVerificationErrors
    ];
    constructor(verificationRepo: IVerificationRepo) {
        this.verificationRepo = verificationRepo;
    }

    public async execute(req: GetVerificationDTO.Request): Promise<GetVerificationDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const verificationFound = await this.verificationRepo.findByUser(req.userId);
        if (verificationFound.isFailure) {
            return Result.fail(verificationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding verification') : UseCaseError.create('a0', 'Verification does not exist'));
        }

        const verificatiton = verificationFound.getValue()!;
        return Result.ok({
            verificationId: verificatiton._id
        });
    }
};