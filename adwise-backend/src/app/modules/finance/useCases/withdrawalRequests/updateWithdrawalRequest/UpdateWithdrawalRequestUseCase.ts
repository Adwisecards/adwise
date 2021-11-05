import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWithdrawalRequestRepo } from "../../../repo/withdrawalRequests/IWithdrawalRequestRepo";
import { IWithdrawalRequestValidationService } from "../../../services/withdrawalRequests/withdrawalRequestValidationService/IWithdrawalRequestValidationService";
import { UpdateWithdrawalRequestDTO } from "./UpdateWithdrawalRequestDTO";
import { updateWithdrawalRequestErrors } from "./updateWithdrawalRequestErrors";

export class UpdateWithdrawalRequestUseCase implements IUseCase<UpdateWithdrawalRequestDTO.Request, UpdateWithdrawalRequestDTO.Response> {
    private withdrawalRequestRepo: IWithdrawalRequestRepo;
    private withdrawalRequestValidationService: IWithdrawalRequestValidationService;

    public errors = updateWithdrawalRequestErrors;

    constructor(
        withdrawalRequestRepo: IWithdrawalRequestRepo,
        withdrawalRequestValidationService: IWithdrawalRequestValidationService
    ) {
        this.withdrawalRequestRepo = withdrawalRequestRepo;
        this.withdrawalRequestValidationService = withdrawalRequestValidationService;
    }

    public async execute(req: UpdateWithdrawalRequestDTO.Request): Promise<UpdateWithdrawalRequestDTO.Response> {
        const valid = this.withdrawalRequestValidationService.updateWithdrawalRequestData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const withdrawalRequestFound = await this.withdrawalRequestRepo.findById(req.withdrawalRequestId);
        if (withdrawalRequestFound.isFailure) {
            return Result.fail(withdrawalRequestFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding withdrawal request') : UseCaseError.create('3'));
        }

        const withdrawalRequest = withdrawalRequestFound.getValue()!;

        if (withdrawalRequest.satisfied) {
            return Result.fail(UseCaseError.create('c', 'Withdrawal request is already satisfied'));
        }

        for (const key in req) {
            if ((<any>req)[key] == undefined) continue;

            if ((<any>withdrawalRequest)[key] != undefined) {
                (<any>withdrawalRequest)[key] = (<any>req)[key];
            }
        }

        const withdrawalRequestSaved = await this.withdrawalRequestRepo.save(withdrawalRequest);
        if (withdrawalRequestSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon withdrawal request'));
        }

        return Result.ok({withdrawalRequestId: req.withdrawalRequestId});
    }
}