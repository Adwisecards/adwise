import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IXlsxService } from "../../../../../services/xlsxService/IXlsxService";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IReceiverGroup } from "../../../models/ReceiverGroup";
import { IReceiverGroupRepo } from "../../../repo/receiverGroups/IReceiverGroupRepo";
import { ExportReceiverGroupDTO } from "./ExportReceiverGroupDTO";
import { exportReceiverGroupErrors } from "./exportReceiverGroupErrors";

interface IKeyObjects {
    receiverGroup: IReceiverGroup;
    users: IUser[];
};

export class ExportReceiverGroupUseCase implements IUseCase<ExportReceiverGroupDTO.Request, ExportReceiverGroupDTO.Response> {
    private userRepo: IUserRepo;
    private xlsxService: IXlsxService;
    private receiverGroupRepo: IReceiverGroupRepo;

    public errors = exportReceiverGroupErrors;

    constructor(userRepo: IUserRepo, xlsxService: IXlsxService, receiverGroupRepo: IReceiverGroupRepo) {
        this.userRepo = userRepo;
        this.xlsxService = xlsxService;
        this.receiverGroupRepo = receiverGroupRepo;
    }

    public async execute(req: ExportReceiverGroupDTO.Request): Promise<ExportReceiverGroupDTO.Response> {
        if (!Types.ObjectId.isValid(req.receiverGroupId)) {
            return Result.fail(UseCaseError.create('c', 'receiverGroupId is not valid'));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.receiverGroupId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            receiverGroup,
            users
        } = keyObjectsGotten.getValue()!;
        
        const xlsxGenerated = await this.xlsxService.convert(users.map(u => {
            return {
                'Имя': `${u.firstName}${u.lastName ? ' '+u.lastName : ''}`,
                'Телефон': u.phone,
                'Эл. почта': u.emailInfo || '-',
                'Device token': u.deviceToken || '-',
                'Push token': u.pushToken || '-'
            };
        }));

        if (xlsxGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
        }

        const xlsx = xlsxGenerated.getValue()!;

        return Result.ok({
            data: xlsx
        });
    }

    private async getKeyObjects(receiverGroupId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const receiverGroupFound = await this.receiverGroupRepo.findById(receiverGroupId);
        if (receiverGroupFound.isFailure) {
            return Result.fail(receiverGroupFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding receiver group') : UseCaseError.create('9'));
        }

        const receiverGroup = receiverGroupFound.getValue()!;

        const userIds = receiverGroup.receivers.map(r => r.toString());

        const usersFound = await this.userRepo.findByIds(userIds);
        if (usersFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding users'));
        }

        const users = usersFound.getValue()!;

        return Result.ok({
            receiverGroup,
            users
        });
    }
}