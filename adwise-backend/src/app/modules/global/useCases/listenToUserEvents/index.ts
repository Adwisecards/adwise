import { contactRepo } from "../../../contacts/repo/contacts";
import { purchaseRepo } from "../../../finance/repo/purchases";
import { eventListenerService } from "../../services/eventListenerService";
import { ListenToUserEventsController } from "./ListenToUserEventsController";
import { ListenToUserEventsUseCase } from "./ListenToUserEventsUseCase";

const listenToUserEventsUseCase = new ListenToUserEventsUseCase(contactRepo, purchaseRepo, eventListenerService);
const listenToUserEventsController = new ListenToUserEventsController(listenToUserEventsUseCase);


export {
    listenToUserEventsUseCase,
    listenToUserEventsController
};