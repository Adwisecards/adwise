import { Types } from "mongoose";
import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { INotificationService } from "../../../../services/notificationService/INotificationService";
import { IContactRepo } from "../../../contacts/repo/contacts/IContactRepo";
import { SendNotificationUseCase } from "../../../notification/useCases/notifications/sendNotification/SendNotificationUseCase";
import { IUserRepo } from "../../../users/repo/users/IUserRepo";
import { TaskModel } from "../../models/Task";
import { ITaskRepo } from "../../repo/ITaskRepo";
import { ITaskValidationService } from "../../services/taskValidationService/ITaskValidationService";
import { CreateTaskDTO } from "./CreateTaskDTO";
import { createTaskErrors } from "./createTaskErrors";

export class CreateTaskUseCase implements IUseCase<CreateTaskDTO.Request, CreateTaskDTO.Response> {
    private taskRepo: ITaskRepo;
    private taskValidationService: ITaskValidationService;
    private contactRepo: IContactRepo;
    private userRepo: IUserRepo;
    private sendNotificationUseCase: SendNotificationUseCase;

    public errors: UseCaseError[] = [
        ...createTaskErrors
    ];
    constructor(
        taskRepo: ITaskRepo, 
        taskValidationService: ITaskValidationService, 
        contactRepo: IContactRepo,  
        userRepo: IUserRepo,
        sendNotificationUseCase: SendNotificationUseCase
    ) {
        this.taskRepo = taskRepo;
        this.taskValidationService = taskValidationService;
        this.contactRepo = contactRepo;
        this.userRepo = userRepo;
        this.sendNotificationUseCase = sendNotificationUseCase;
    }

    public async execute(req: CreateTaskDTO.Request): Promise<CreateTaskDTO.Response> {
        const {contactId} = req; delete req.contactId;
        const valid = this.taskValidationService.createTaskData(req);
        if (!Types.ObjectId.isValid(contactId!)) {
            return Result.fail(UseCaseError.create('c', 'Contact ID must be valid'));
        }

        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        req.participants.push(contactId!);
        const task = new TaskModel({
            name: req.name,
            description: req.description,
            author: contactId,
            date: req.date,
            time: req.time,
            participants: req.participants
        });

        const taskSaved = await this.taskRepo.save(task);
        if (taskSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving task'));
        }

        for (const participant of req.participants) {
            const contactFound = await this.contactRepo.findById(participant);
            if (contactFound.isFailure) {
                continue;
            } else {
                const contact = contactFound.getValue()!;
                const userFound = await this.userRepo.findById(contact.ref.toHexString());
                if (userFound.isFailure) {
                    continue;
                }

                const user = userFound.getValue()!;
                
                await this.sendNotificationUseCase.execute({
                    receiverIds: [user._id.toString()],
                    type: 'taskCreated',
                    values: {
                        taskName: task.name
                    },
                    data: {
                        taskId: task._id
                    }
                });
            }
        }

        return Result.ok({
            taskId: task._id
        });
    }
}