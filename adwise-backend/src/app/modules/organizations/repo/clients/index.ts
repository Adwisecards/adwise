import { ClientModel } from "../../models/Client";
import { ClientRepo } from "./implementation/ClientRepo";

const clientRepo = new ClientRepo(ClientModel);

export {
    clientRepo
};