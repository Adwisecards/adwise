import { ChatModel } from "../../models/Chat";
import { ChatRepo } from "./implementation/ChatRepo";

export const chatRepo = new ChatRepo(ChatModel);