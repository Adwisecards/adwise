import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IContactRepo } from "../../../repo/contacts/IContactRepo";
import { IRequestRepo } from "../../../repo/requests/IRequestRepo";
import { CancelRequestDTO } from "./CancelRequestDTO";
import { cancelRequestErrors } from "./cancelRequestErrors";

export class CancelRequestUseCase implements IUseCase<CancelRequestDTO.Request, CancelRequestDTO.Response> {
    private userRepo: IUserRepo;
    private contactRepo: IContactRepo;
    private requestRepo: IRequestRepo;
    public errors: UseCaseError[] = [
        ...cancelRequestErrors
    ];

    constructor(userRepo: IUserRepo, contactRepo: IContactRepo, requestRepo: IRequestRepo) {
        this.contactRepo = contactRepo;
        this.userRepo = userRepo;
        this.requestRepo = requestRepo;
    }

    public async execute(req: CancelRequestDTO.Request): Promise<CancelRequestDTO.Response> {
        if (!Types.ObjectId.isValid(req.requestId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const requestFound = await this.requestRepo.findById(req.requestId);
        if (requestFound.isFailure) {
            return Result.fail(requestFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const request = requestFound.getValue()!;

        const requestedContactFound = await this.contactRepo.findById(request.to.toHexString());
        if (requestedContactFound.isFailure) {
            return Result.fail(requestedContactFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('c'));
        }

        const requestedContact = requestedContactFound.getValue()!;

        const userFound = await this.userRepo.findById(requestedContact.ref.toHexString());
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const requestIndex = user.requests.findIndex(r => r.toHexString() == request._id);
        if (requestIndex >= 0) {
            user.requests.splice(requestIndex, 1);
        }

        await this.userRepo.save(user);
        await this.requestRepo.deleteById(req.requestId);

        return Result.ok({requestId: req.requestId});
    }
}
