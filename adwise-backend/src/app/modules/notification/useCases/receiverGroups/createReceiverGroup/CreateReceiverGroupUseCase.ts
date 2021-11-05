import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ReceiverGroupModel } from "../../../models/ReceiverGroup";
import { IReceiverGroupRepo } from "../../../repo/receiverGroups/IReceiverGroupRepo";
import { IReceiverGroupValidationService } from "../../../services/receiverGroups/receiverGroupValidationService/IReceiverGroupValidationService";
import { UpdateReceiverGroupUseCase } from "../updateReceiverGroup/UpdateReceiverGroupUseCase";
import { CreateReceiverGroupDTO } from "./CreateReceiverGroupDTO";
import { createReceiverGroupErrors } from "./createReceiverGroupErrors";

export class CreateReceiverGroupUseCase implements IUseCase<CreateReceiverGroupDTO.Request, CreateReceiverGroupDTO.Response> {
    private receiverGroupRepo: IReceiverGroupRepo;
    private updateReceiverGroupUseCase: UpdateReceiverGroupUseCase;
    private receiverGroupValidationService: IReceiverGroupValidationService;

    public errors = createReceiverGroupErrors;

    constructor(
        receiverGroupRepo: IReceiverGroupRepo,
        updateReceiverGroupUseCase: UpdateReceiverGroupUseCase,
        receiverGroupValidationService: IReceiverGroupValidationService
    ) {
        this.receiverGroupRepo = receiverGroupRepo;
        this.updateReceiverGroupUseCase = updateReceiverGroupUseCase;
        this.receiverGroupValidationService = receiverGroupValidationService;
    }

    public async execute(req: CreateReceiverGroupDTO.Request): Promise<CreateReceiverGroupDTO.Response> {
        const valid = this.receiverGroupValidationService.createReceiverGroupData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const receiverGroup = new ReceiverGroupModel({
            name: req.name,
            parameters: req.parameters,
            wantedReceivers: req.wantedReceiverIds
        });

        const receiverGroupSaved = await this.receiverGroupRepo.save(receiverGroup);

        if (receiverGroupSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving receiver group'));
        }

        const receiverGroupUpdated = await this.updateReceiverGroupUseCase.execute({
            receiverGroupId: receiverGroup._id.toString()
        });

        if (receiverGroupUpdated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon updating receiver group'));
        }

        return Result.ok({receiverGroupId: receiverGroup._id});
    }
}