import { Types } from "mongoose";
import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IContactRepo } from "../../../contacts/repo/contacts/IContactRepo";
import { IPurchaseRepo } from "../../../finance/repo/purchases/IPurchaseRepo";
import { IEventListenerService } from "../../services/eventListenerService/IEventListenerService";
import { ListenToUserEventsDTO } from "./ListenToUserEventsDTO";
import { listenToUserEventsErrors } from "./listenToUserEventsErrors";

export class ListenToUserEventsUseCase implements IUseCase<ListenToUserEventsDTO.Request, ListenToUserEventsDTO.Response> {
    private contactRepo: IContactRepo;
    private purchaseRepo: IPurchaseRepo;
    private eventListenerService: IEventListenerService;

    public errors = [
        ...listenToUserEventsErrors
    ];

    constructor(contactRepo: IContactRepo, purchaseRepo: IPurchaseRepo, eventListenerService: IEventListenerService) {
        this.contactRepo = contactRepo;
        this.purchaseRepo = purchaseRepo;
        this.eventListenerService = eventListenerService;
    }

    public async execute(req: ListenToUserEventsDTO.Request): Promise<ListenToUserEventsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }
        console.log(req);
        if (req.type == 'open') {
            this.eventListenerService.addListener(req.userId, req.ws);
        } else {
            this.eventListenerService.deleteListener(req.userId);
        }
        

        return Result.ok({

        });
    }
}