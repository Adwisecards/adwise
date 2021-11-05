import { MessageModel } from "../../models/Message";
import { MessageRepo } from "./implementation/MessageRepo";

export const messageRepo = new MessageRepo(MessageModel);