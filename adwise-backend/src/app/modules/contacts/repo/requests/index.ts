import { RequestModel } from "../../models/Request";
import { RequestRepo } from "./implementation/RequestRepo";

const requestRepo = new RequestRepo(RequestModel);

export {
    requestRepo
};